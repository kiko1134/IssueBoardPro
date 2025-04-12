const { Note } = require('../models');

exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Неуспешно извличане на бележки' });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (note) {
            res.json(note);
        } else {
            res.status(404).json({ error: 'Бележката не е намерена' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при търсене на бележка' });
    }
};

exports.createNote = async (req, res) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ error: 'Грешка при създаване на бележка' });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (note) {
            await note.update(req.body);
            res.json(note);
        } else {
            res.status(404).json({ error: 'Бележката не е намерена' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при актуализация на бележка' });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (note) {
            await note.destroy();
            res.json({ message: 'Бележката е изтрита успешно' });
        } else {
            res.status(404).json({ error: 'Бележката не е намерена' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при изтриване на бележка' });
    }
};