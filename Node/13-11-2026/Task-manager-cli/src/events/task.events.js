const EventEmitter = require("events");
const fs = require("fs/promises");

const { AUDIT_FILE } = require("../config/paths");

class TaskEventEmitter extends EventEmitter {

    constructor() {
        super();

        this.auditQueue = Promise.resolve();
        this.lastWrite = Promise.resolve();

        // Task added listener
        this.on("task:added", (task) => {
            this.log("ADDED", task);
        });

        // Task completed listener
        this.on("task:completed", (task) => {
            this.log("COMPLETED", task);
        });

        // Task deleted listener
        this.on("task:deleted", (task) => {
            this.log("DELETED", task);
        });
    }

    // Write event into audit.log
    log(action, task) {

        const record = {
            timestamp: new Date().toISOString(),
            action,
            taskId: task.id,
            title: task.title
        };

        const operation = this.auditQueue.then(() => {
            return fs.appendFile(
                AUDIT_FILE,
                JSON.stringify(record) + "\n",
                "utf-8"
            );
        });

        this.auditQueue = operation.catch(() => {});

        this.lastWrite = operation;
    }

    // Emit event and wait for audit logging(wait for asynchronous listeners.)
    async publish(event, task) {

        this.emit(event, task);

        await this.lastWrite;
    }
}

module.exports = new TaskEventEmitter();