
export function sendToSocket(
    notifications,
    socketId,
    notification
) {
    notifications.to(socketId).emit(
        "notification",
        notification
    );
}

export function sendToUser(
    notifications,
    userId,
    notification
) {
    notifications.to(`user:${userId}`).emit(
        "notification",
        notification
    );
}
