const AppError = require("./errors");

const VALID_PRIORITIES = ["high", "medium", "low"];

// Validate task input
function validateTaskInput({ title, description, priority }) {

    if (typeof title !== "string" || !title.trim()) {
        throw new AppError("Title is required");
    }

    if (typeof description !== "string") {
        throw new AppError("Description must be a string");
    }

    if (
        typeof priority !== "string" ||
        !VALID_PRIORITIES.includes(priority.toLowerCase())
    ) {
        throw new AppError(
            "Priority must be high, medium, or low"
        );
    }

    return {
        title: title.trim(),
        description: description.trim(),
        priority: priority.toLowerCase()
    };
}

// Validate task ID
function validateId(id) {

    const parsedId = Number(id);

    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
        throw new AppError("Invalid task ID");
    }

    return parsedId;
}

module.exports = {
    validateTaskInput,
    validateId
};