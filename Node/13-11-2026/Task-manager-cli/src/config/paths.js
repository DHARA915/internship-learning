const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../../");

module.exports = {
    DATA_DIR: path.join(ROOT_DIR, "data"),
    IMPORT_DIR: path.join(ROOT_DIR, "imports"),
    EXPORT_DIR: path.join(ROOT_DIR, "exports"),

    TASKS_FILE: path.join(ROOT_DIR, "data", "tasks.json"),
    AUDIT_FILE: path.join(ROOT_DIR, "data", "audit.log")
};