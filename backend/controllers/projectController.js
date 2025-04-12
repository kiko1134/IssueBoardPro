const { Project } = require('../models');

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане на проекти' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Проектът не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при извличане на проект' });
    }
};

exports.createProject = async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: 'Грешка при създаване на проект' });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.update(req.body);
            res.json(project);
        } else {
            res.status(404).json({ error: 'Проектът не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при актуализиране на проект' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.destroy();
            res.json({ message: 'Проектът е изтрит успешно' });
        } else {
            res.status(404).json({ error: 'Проектът не е намерен' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Грешка при изтриване на проект' });
    }
};