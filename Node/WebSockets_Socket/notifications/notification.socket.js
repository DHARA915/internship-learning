
import { authenticateSocket } from "../middleware/socketAuth.js";

import {
    sendToSocket,
    sendToUser
} from "./notification.service.js";

export function registerNotificationNamespace(io) {
    const notifications = io.of("/notifications");

    // JWT authentication
    notifications.use(authenticateSocket);

    notifications.on("connection", (socket) => {
        const userId = String(socket.user.id);

        // Each user joins their own private notification room
        socket.join(`user:${userId}`);

        console.log("Notification user connected:", userId);
        console.log("Notification socket ID:", socket.id);

        // Admin sends a notification
        socket.on("send_notification", (data) => {

            // Admin authorization
            if (socket.user.role !== "admin") {
                socket.emit(
                    "notification_error",
                    "Admin access required"
                );
                return;
            }

            const {
                targetType,
                targetId,
                title,
                message
            } = data || {};

            // Payload validation
            if (
                !["user", "socket"].includes(targetType) ||
                typeof targetId !== "string" ||
                !targetId.trim() ||
                typeof title !== "string" ||
                !title.trim() ||
                title.length > 120 ||
                typeof message !== "string" ||
                !message.trim() ||
                message.length > 2000
            ) {
                socket.emit(
                    "notification_error",
                    "Invalid notification data"
                );
                return;
            }

            const notification = {
                title: title.trim(),
                message: message.trim(),
                sentAt: new Date().toISOString()
            };

            // Send to all devices of a user
            if (targetType === "user") {
                sendToUser(
                    notifications,
                    targetId,
                    notification
                );
            }

            // Send to one specific socket
            if (targetType === "socket") {
                sendToSocket(
                    notifications,
                    targetId,
                    notification
                );
            }

            socket.emit("notification_sent", {
                targetType,
                targetId
            });

            console.log("Notification sent:", {
                targetType,
                targetId
            });
        });

        socket.on("disconnect", (reason) => {
            console.log(
                "Notification user disconnected:",
                userId,
                reason
            );
        });
    });

    return notifications;
}
