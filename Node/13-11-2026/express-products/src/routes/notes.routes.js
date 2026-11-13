const express = require("express");
const router = express.Router();

const notesController = require("../controllers/notes.controller");

const validate = require("../middleware/validate.middleware");

const {
    createNoteSchema,
    updateNoteSchema
} = require("../validators/notes.validator");

// GET all notes
router.get("/", notesController.getAllNotes);

// GET note by ID
router.get("/:id", notesController.getNoteById);

// POST create note
router.post(
    "/",
    validate(createNoteSchema),
    notesController.createNote
);

// PUT update note
router.put(
    "/:id",
    validate(updateNoteSchema),
    notesController.updateNote
);

// DELETE note
router.delete("/:id", notesController.deleteNote);

module.exports = router;