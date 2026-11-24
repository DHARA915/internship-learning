import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { authenticateSocket } from "./middleware/socketAuth.js";
import webhookRoutes from "./routes/webhook.route.js";
import { registerNotificationNamespace } from "./notifications/notification.socket.js";
import { registerEventHandlers } from "./eventBus/events/eventHandlers.js";
import eventRoutes from "./routes/event.route.js"
import orderRoutes from "./routes/order.route.js"
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./config/redisClient.js";
import postRoutes from './routes/post.route.js'
import cors from "cors";

const app = express();
const httpServer = createServer(app);

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
}

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Communicate between two server
io.adapter(createAdapter(pubClient, subClient));
console.log("Socket.IO Redis adapter connected");

app.set("io", io);
registerEventHandlers(io);

// Enable CORS for the admin dashboard
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// app.use(express.json());
app.use(express.json({
    verify: (req, res, buffer) => {
        req.rawBody = Buffer.from(buffer);
    }
}));

// API routes
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/posts", postRoutes);

// Presence tracking
// Map<roomName, Map<userId, Set<socketId>>>
const roomUsers = new Map();

// Add user to room presence
function addUserToRoom(room, userId, socketId) {
    if (!roomUsers.has(room)) {
        roomUsers.set(room, new Map());
    }

    const users = roomUsers.get(room);

    if (!users.has(userId)) {
        users.set(userId, new Set());
    }

    users.get(userId).add(socketId);
}

// Remove socket from room presence
function removeUserFromRoom(room, userId, socketId) {
    const users = roomUsers.get(room);

    if (!users) return;

    const sockets = users.get(userId);

    if (!sockets) return;

    sockets.delete(socketId);

    // Remove user only when all their connections are gone
    if (sockets.size === 0) {
        users.delete(userId);
    }

    // Remove empty room
    if (users.size === 0) {
        roomUsers.delete(room);
    }
}

// Get online users in a room
function getOnlineUsers(room) {
    const users = roomUsers.get(room);

    return users ? [...users.keys()] : [];
}

// Broadcast online users
function emitOnlineUsers(room) {
    io.to(room).emit("users_online", {
        room,
        users: getOnlineUsers(room)
    });
}

io.use(authenticateSocket);

app.get("/", (req, res) => {
    res.send("Socket.IO server is running");
});

// Socket.IO Connection
io.on("connection", (socket) => {
    // Join admin room
    if (socket.user?.role === "admin") {
        socket.join("admins");
        console.log("Admin joined admins room:", socket.user.id);
    }

    console.log("Authenticated user connected:", socket.user);
    console.log("Socket ID:", socket.id);

        // Join global activity room
    socket.join("activity");
    console.log(`User ${socket.user.id} joined activity room`);

    // Global chat
    socket.on("message", (message) => {
        if (typeof message !== "string" || !message.trim()) return;

        io.emit("message", {
            sender: socket.user.id,
            text: message.trim()
        });
    });

    // Join room
    socket.on("joinRoom", async (roomName) => {
        if (typeof roomName !== "string") return;

        const room = roomName.trim();

        if (!room) {
            socket.emit("errorMessage", "Room name is required");
            return;
        }

        const previousRoom = socket.data.room;

        // Leave previous room
        if (previousRoom && previousRoom !== room) {
            await socket.leave(previousRoom);

            removeUserFromRoom(
                previousRoom,
                socket.user.id,
                socket.id
            );

            emitOnlineUsers(previousRoom);
        }

        // Join new room
        await socket.join(room);

        socket.data.room = room;

        addUserToRoom(room, socket.user.id, socket.id);

        console.log(`${socket.user.id} joined ${room}`);

        socket.emit("roomJoined", room);

        socket.to(room).emit("userJoined", socket.user.id);

        // Broadcast updated online users
        emitOnlineUsers(room);
    });

    // Room-based messaging
    socket.on("roomMessage", (message) => {
        const room = socket.data.room;

        if (!room) {
            socket.emit("errorMessage", "Join a room first!");
            return;
        }

        if (typeof message !== "string" || !message.trim()) return;

        io.to(room).emit("roomMessage", {
            sender: socket.user.id,
            text: message.trim(),
            room
        });
    });

    // Typing indicator
    socket.on("typing", () => {
        const room = socket.data.room;

        if (!room) return;

        socket.to(room).emit("user_typing", {
            userId: socket.user.id
        });
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
        const room = socket.data.room;

        if (room) {
            removeUserFromRoom(
                room,
                socket.user.id,
                socket.id
            );

            emitOnlineUsers(room);
        }

        console.log("User disconnected:", socket.user.id);
        console.log("Reason:", reason);
    });
});

registerNotificationNamespace(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
