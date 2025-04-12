const { Issue } = require('../../models');

const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.findAll();
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане на issues.' });
    }
};

const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findByPk(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue не е намерен.' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане.' });
    }
};

const createIssue = async (req, res) => {
    try {
        const newIssue = await Issue.create(req.body);
        res.status(201).json(newIssue);
    } catch (err) {
        res.status(400).json({ error: 'Грешка при създаване на issue.' });
    }
};

const updateIssue = async (req, res) => {
    try {
        const issue = await Issue.findByPk(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue не е намерен.' });

        await issue.update(req.body);
        res.json(issue);
    } catch (err) {
        res.status(400).json({ error: 'Грешка при обновяване на issue.' });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findByPk(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue не е намерен.' });

        await issue.destroy();
        res.json({ message: 'Issue изтрит успешно.' });
    } catch (err) {
        res.status(500).json({ error: 'Грешка при изтриване.' });
    }
};

module.exports = {
    getAllIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue
};