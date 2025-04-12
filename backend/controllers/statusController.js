const { Status } = require('../models');

exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.findAll();
        res.json(statuses);
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане на статусите' });
    }
};

exports.getStatusById = async (req, res) => {
    try {
        const status = await Status.findByPk(req.params.id);
        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ error: 'Статусът не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане на статус' });
    }
};

exports.createStatus = async (req, res) => {
    try {
        const newStatus = await Status.create(req.body);
        res.status(201).json(newStatus);
    } catch (err) {
        res.status(400).json({ error: 'Грешка при създаване на статус' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const status = await Status.findByPk(req.params.id);
        if (status) {
            await status.update(req.body);
            res.json(status);
        } else {
            res.status(404).json({ error: 'Статусът не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при актуализиране на статус' });
    }
};

exports.deleteStatus = async (req, res) => {
    try {
        const status = await Status.findByPk(req.params.id);
        if (status) {
            await status.destroy();
            res.json({ message: 'Статусът е изтрит успешно' });
        } else {
            res.status(404).json({ error: 'Статусът не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при изтриване на статус' });
    }
};