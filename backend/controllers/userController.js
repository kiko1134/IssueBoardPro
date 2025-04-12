const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане на потребители' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Потребителят не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане на потребител' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const { password, ...userData } = newUser.toJSON();
        res.status(201).json(userData);
    } catch (err) {
        res.status(400).json({ error: 'Грешка при създаване на потребител' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            const { password, ...userData } = user.toJSON();
            res.json(userData);
        } else {
            res.status(404).json({ error: 'Потребителят не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при актуализиране на потребител' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'Потребителят е изтрит успешно' });
        } else {
            res.status(404).json({ error: 'Потребителят не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при изтриване на потребител' });
    }
};