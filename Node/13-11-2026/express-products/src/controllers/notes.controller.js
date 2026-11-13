const notesService = require("../services/notes.service");

// GET all notes
function getAllNotes(req, res) {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { category, search, isArchived } = req.query;

    // Validate pagination
    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1 ||
        limit > 100
    ) {
        const error = new Error(
            "Page must be positive and limit must be between 1 and 100"
        );

        error.statusCode = 400;
        throw error;
    }

    // Validate archive filter
    let archivedFilter;

    if (isArchived !== undefined) {
        if (!["true", "false"].includes(isArchived)) {
            const error = new Error("isArchived must be true or false");
            error.statusCode = 400;
            throw error;
        }

        archivedFilter = isArchived === "true";
    }

    const result = notesService.getAllNotes({
        page,
        limit,
        category,
        search,
        isArchived: archivedFilter
    });

    res.status(200).json({
        success: true,
        data: result
    });
}

// GET note by ID
function getNoteById(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        const error = new Error("Invalid note ID");
        error.statusCode = 400;
        throw error;
    }

    const note = notesService.getNoteById(id);

    if (!note) {
        const error = new Error("Note not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        data: note
    });
}

// POST create note
function createNote(req, res) {
    const note = notesService.createNote(req.body);

    res.status(201).json({
        success: true,
        message: "Note created successfully",
        data: note
    });
}

// PUT update note
function updateNote(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        const error = new Error("Invalid note ID");
        error.statusCode = 400;
        throw error;
    }

    const note = notesService.updateNote(id, req.body);

    if (!note) {
        const error = new Error("Note not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        message: "Note updated successfully",
        data: note
    });
}

// DELETE note
function deleteNote(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        const error = new Error("Invalid note ID");
        error.statusCode = 400;
        throw error;
    }

    const note = notesService.deleteNote(id);

    if (!note) {
        const error = new Error("Note not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        message: "Note deleted successfully",
        data: note
    });
}

module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};