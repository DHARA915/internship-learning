const {
    readTasks,
    writeTasks
} = require("../repositories/task.repository");

const taskEvents = require("../events/task.events");

const {
    validateTaskInput,
    validateId
} = require("../utils/validators");

const AppError = require("../utils/errors");

async function addTask(input) {
    // Validate user input
    const data = validateTaskInput(input);

    // Read existing tasks
    const tasks = await readTasks();

    // Generate unique ID
    const id = tasks.length
        ? Math.max(...tasks.map(task => task.id)) + 1
        : 1;

    // Create new task
    const newTask = {
        id,
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    // Add task to array
    tasks.push(newTask);

    // Save updated tasks
    await writeTasks(tasks);
    await taskEvents.publish("task:added", newTask);

    return newTask;
}

async function listTasks() {
    const tasks = await readTasks();

    return tasks;
}

async function completeTask(id) {
    const taskId = validateId(id);

    const tasks = await readTasks();

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    if (task.status === "completed") {
        throw new AppError("Task is already completed");
    }

    task.status = "completed";
    task.completedAt = new Date().toISOString();

    await writeTasks(tasks);

    // Emit completion event
    await taskEvents.publish("task:completed", task);

    return task;
}

async function deleteTask(id) {
    const taskId = validateId(id);

    const tasks = await readTasks();

    const index = tasks.findIndex(
        task => task.id === taskId
    );

    if (index === -1) {
        throw new AppError("Task not found", 404);
    }

    const deletedTask = tasks.splice(index, 1)[0];

    await writeTasks(tasks);
    // Emit deletion event
    await taskEvents.publish("task:deleted", deletedTask);

    return deletedTask;
}

async function searchTasks(keyword) {
    if (typeof keyword !== "string" || !keyword.trim()) {
        throw new AppError("Search keyword is required");
    }

    const tasks = await readTasks();

    const searchTerm = keyword.trim().toLowerCase();

    return tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
    );
}

module.exports = {
    addTask,
    listTasks,
    completeTask,
    deleteTask,
    searchTasks
};