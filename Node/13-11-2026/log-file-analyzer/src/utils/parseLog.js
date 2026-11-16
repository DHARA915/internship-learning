
function parseLog(line) {
    const pattern = /^\[([^\]]+)\]\s+\[(INFO|WARN|ERROR|DEBUG)\]\s+(.+)$/;

    const result = line.match(pattern);

    if (!result) {
        return null;
    }

    const [, timestamp, level, message] = result;

    return {
        timestamp,
        level,
        message
    };
}

module.exports = parseLog;
