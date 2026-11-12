// Task:3  Q:8  Create a custom EventEmitter class ‘TaskRunner’: emit ‘start’, ‘progress’, ‘complete’, ‘error’ events. Register listeners for each.


const EventEmitter = require("events");

// Utility function to simulate a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Custom EventEmitter class
class TaskRunner extends EventEmitter {
    constructor(taskName) {
        super();
        this.taskName = taskName;
    }

    async run() {
        try {
            // Task started
            this.emit("start", {
                task: this.taskName,
                message: "Task execution started"
            });

            // Simulate task progress
            for (let progress = 25; progress <= 100; progress += 25) {
                await delay(1000);

                this.emit("progress", {
                    task: this.taskName,
                    percentage: progress
                });
            }

            // Task completed
            this.emit("complete", {
                task: this.taskName,
                message: "Task completed successfully"
            });

        } catch (error) {
            // Handle and emit errors
            this.emit("error", error);
        }
    }
}

// Create an instance
const runner = new TaskRunner("File Upload");

// Register event listeners
runner.on("start", (data) => {
    console.log(`[START] ${data.task}: ${data.message}`);
});

runner.on("progress", (data) => {
    console.log(`[PROGRESS] ${data.task}: ${data.percentage}%`);
});

runner.on("complete", (data) => {
    console.log(`[COMPLETE] ${data.task}: ${data.message}`);
});

runner.on("error", (error) => {
    console.error(`[ERROR] ${error.message}`);
});

// Execute the task
runner.run();

