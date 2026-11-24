
export function streamEvents(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.flushHeaders();

    const sendEvent = () => {
        const eventData = {
            timestamp: new Date().toISOString(),
            clientCount: req.app.get("io").of("/").sockets.size
        };

        res.write("event: server-update\n");
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    };

    sendEvent();

    const interval = setInterval(sendEvent, 5000);

    req.on("close", () => {
        clearInterval(interval);
        console.log("SSE client disconnected");
    });
}
