const notes = require("../models/notes.model");

// Get all notes with filtering and pagination
function getAllNotes(filters) {
    let result = [...notes];

    // Filter by category
    if (filters.category) {
        result = result.filter(note =>
            note.category.toLowerCase() === filters.category.toLowerCase()
        );
    }

    // Search by title or content
    if (filters.search) {
        const search = filters.search.toLowerCase();

        result = result.filter(note =>
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        );
    }

    // Filter by archive status
    if (filters.isArchived !== undefined) {
        result = result.filter(
            note => note.isArchived === filters.isArchived
        );
    }

    // Sort newest first
    result.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Pagination
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / filters.limit);

    const startIndex = (filters.page - 1) * filters.limit;

    const items = result.slice(
        startIndex,
        startIndex + filters.limit
    );

    return {
        items,
        page: filters.page,
        limit: filters.limit,
        totalPages,
        totalItems
    };
}

// Get note by ID
function getNoteById(id) {
    return notes.find(note => note.id === id) || null;
}

// Create note
function createNote(data) {
    const newNote = {
        id: notes.length
            ? Math.max(...notes.map(note => note.id)) + 1
            : 1,

        title: data.title,
        content: data.content,
        category: data.category,
        isArchived: data.isArchived ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    notes.push(newNote);

    return newNote;
}

// Update note
function updateNote(id, data) {
    const note = getNoteById(id);

    if (!note) return null;

    note.title = data.title;
    note.content = data.content;
    note.category = data.category;

    if (data.isArchived !== undefined) {
        note.isArchived = data.isArchived;
    }

    note.updatedAt = new Date();

    return note;
}

// Delete note
function deleteNote(id) {
    const index = notes.findIndex(note => note.id === id);

    if (index === -1) return null;

    return notes.splice(index, 1)[0];
}

module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};