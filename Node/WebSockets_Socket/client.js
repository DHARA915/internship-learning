
import { io } from "socket.io-client";
import readline from "node:readline";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluMTIzIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5NTUyNDAwMSwiZXhwIjoxNzk1NTI3NjAxfQ.mv7xinPCFgbvm3OscfLIgQR7Xbg8G2LOXX3Ij-2VeC0";

// const serverUrl = "http://localhost:3000";

// For testing two server communication using radisadapter
const serverUrl = process.env.SERVER_URL || "http://localhost:3001";

const socket = io(serverUrl, {
    auth: { token }
});

const notificationSocket = io(`${serverUrl}/notifications`, {
    auth: { token }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt("> ");

let currentRoom = null;

socket.on("connect", () => {
    console.log("Admin connected:", socket.id);
    console.log("\nChat connected:", socket.id);
    console.log("\nCommands:");
    console.log("/join roomName");
    console.log("/all message");
    console.log("/notify-user userId Title | Message");
    console.log("/notify-socket socketId Title | Message");
    console.log("/exit\n");

    rl.prompt();
});

socket.on("connect_error", (error) => {
    console.log("\nChat connection error:", error.message);
    rl.prompt();
});

notificationSocket.on("connect", () => {
    console.log("Notification connected:", notificationSocket.id);
    rl.prompt();
});

notificationSocket.on("connect_error", (error) => {
    console.log("\nNotification connection error:", error.message);
    rl.prompt();
});

notificationSocket.on("notification", (data) => {
    console.log("\n\n========== NEW NOTIFICATION ==========");
    console.log("Title:", data.title);
    console.log("Message:", data.message);
    console.log("Received:", data.sentAt);
    console.log("======================================\n");

    rl.prompt();
});

notificationSocket.on("notification_error", (error) => {
    console.log("\nNotification error:", error);
    rl.prompt();
});

notificationSocket.on("notification_sent", (data) => {
    console.log("\nNotification sent successfully:", data);
    rl.prompt();
});

rl.on("line", (input) => {
    const message = input.trim();

    if (!message) {
        rl.prompt();
        return;
    }

    if (message === "/exit") {
        socket.disconnect();
        notificationSocket.disconnect();
        rl.close();
        return;
    }

    if (
        message.startsWith("/notify-user ") ||
        message.startsWith("/notify-socket ")
    ) {
        const match = message.match(
            /^\/notify-(user|socket)\s+(\S+)\s+(.+?)\s*\|\s*(.+)$/
        );

        if (!match) {
            console.log(
                "Format: /notify-user userId Title | Message"
            );
            console.log(
                "Format: /notify-socket socketId Title | Message"
            );
            rl.prompt();
            return;
        }

        const [, targetType, targetId, title, notificationMessage] = match;

        notificationSocket.emit("send_notification", {
            targetType,
            targetId,
            title: title.trim(),
            message: notificationMessage.trim()
        });

        rl.prompt();
        return;
    }

    if (message.startsWith("/join ")) {
        const roomName = message.slice(6).trim();

        if (!roomName) {
            console.log("Please provide a room name.");
            rl.prompt();
            return;
        }

        socket.emit("joinRoom", roomName);
        rl.prompt();
        return;
    }

    if (message.startsWith("/all ")) {
        const globalMessage = message.slice(5).trim();

        if (!globalMessage) {
            console.log("Please provide a message.");
            rl.prompt();
            return;
        }

        socket.emit("message", globalMessage);
        rl.prompt();
        return;
    }

    if (!currentRoom) {
        console.log("Join a room first using /join roomName");
        rl.prompt();
        return;
    }

    socket.emit("typing");
    socket.emit("roomMessage", message);

    rl.prompt();
});

socket.on("roomJoined", (roomName) => {
    currentRoom = roomName;
    console.log(`\nJoined room: ${roomName}`);
    rl.prompt();
});

socket.on("users_online", (users) => {
    console.log("\nOnline users:", users);
    rl.prompt();
});

socket.on("user_typing", (data) => {
    console.log(`\n${data.userId} is typing...`);
    rl.prompt();
});

socket.on("message", (data) => {
    console.log(`\n[Global] ${data.sender}: ${data.text}`);
    rl.prompt();
});

socket.on("roomMessage", (data) => {
    console.log(`\n[${data.room}] ${data.sender}: ${data.text}`);
    rl.prompt();
});

socket.on("userJoined", (data) => {
    console.log(`\n${data.userId} joined ${data.room}`);
    rl.prompt();
});

socket.on("errorMessage", (message) => {
    console.log("\nError:", message);
    rl.prompt();
});

socket.on("disconnect", (reason) => {
    console.log("\nChat disconnected:", reason);
});

socket.on("notification", (data) => {
    console.log("🔔 ADMIN RECEIVED NOTIFICATION!");
    console.log(data);
});

rl.on("close", () => {
    socket.disconnect();
    notificationSocket.disconnect();
    process.exit(0);
});

socket.on("activity:new", (activity) => {
    console.log("\n========== NEW ACTIVITY ==========");
    console.log("Type:", activity.type);
    console.log("Message:", activity.message);
    console.log("Actor:", activity.actor.name);
    console.log("Post:", activity.post.title);
    console.log("Time:", activity.timestamp);
    console.log("==================================\n");
});
