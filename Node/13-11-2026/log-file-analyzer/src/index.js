const processLogs = require("./streams/logProcessor");

function parseArguments() {

    const args = process.argv.slice(2);

    const options = {};

    for (const arg of args) {

        const [key, value] = arg.split("=");

        options[key.replace("--", "")] = value;
    }

    return options;
}

async function main() {

    try {

        const options = parseArguments();

        const allowedLevels = [
            "INFO",
            "WARN",
            "ERROR",
            "DEBUG"
        ];

        const level = options.level?.toUpperCase();

        if (level && !allowedLevels.includes(level)) {
            throw new Error("Invalid log level");
        }

        const from = options.from
            ? new Date(options.from)
            : null;

        let to = options.to
            ? new Date(options.to)
            : null;

        if (
            options.from &&
            Number.isNaN(from.getTime())
        ) {
            throw new Error("Invalid from date");
        }

        if (
            options.to &&
            Number.isNaN(to.getTime())
        ) {
            throw new Error("Invalid to date");
        }

        // Include the entire ending date
        if (to && /^\d{4}-\d{2}-\d{2}$/.test(options.to)) {
            to.setUTCHours(23, 59, 59, 999);
        }

        if (from && to && from > to) {
            throw new Error("From date cannot be after to date");
        }

        await processLogs({
            level,
            from,
            to
        });

    } catch (error) {

        console.error("Error:", error.message);

    }
}

main();