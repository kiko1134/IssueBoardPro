import { RequestHandler } from 'express';
import db from '../db/models';

const { Issue } = db;

export default class IssueController {
    /** GET /api/issues — list all issues (optional ?projectId) */
    static index: RequestHandler = async (req, res, next) => {
        try {
            const where: any = {};
            if (req.query.projectId) {
                where.projectId = Number(req.query.projectId);
            }
            const issues = await Issue.findAll({ where });
            res.json(issues);
        } catch (err) {
            next(err);
        }
    };

    /** GET /api/issues/:id — get single issue */
    static show: RequestHandler = async (req, res, next) => {
        try {
            const issue = await Issue.findByPk(req.params.id);
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }
            res.json(issue);
        } catch (err) {
            next(err);
        }
    };

    /** POST /api/issues — create a new issue */
    static store: RequestHandler = async (req, res, next) => {
        const {
            title, description, statusId, projectId,
            assignedTo, assignedBy, dueDate,
            priority, type, workLog, columnId,
        } = req.body;

        // require minimally
        if (!title || !statusId || !projectId || !priority || !type) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        try {
            const issue = await Issue.create({
                title, description, statusId, projectId,
                assignedTo, assignedBy, dueDate,
                priority, type, workLog, columnId,
            });
            res.status(201).json(issue);
        } catch (err) {
            next(err);
        }
    };

    /** PUT /api/issues/:id — update an issue */
    static update: RequestHandler = async (req, res, next) => {
        try {
            const [updatedCount] = await Issue.update(req.body, {
                where: { id: req.params.id },
            });
            if (!updatedCount) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }
            const issue = await Issue.findByPk(req.params.id);
            res.json(issue);
        } catch (err) {
            next(err);
        }
    };

    /** DELETE /api/issues/:id — delete an issue */
    static destroy: RequestHandler = async (req, res, next) => {
        try {
            const deletedCount = await Issue.destroy({
                where: { id: req.params.id },
            });
            if (!deletedCount) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }
            res.json({ message: 'Issue deleted' });
        } catch (err) {
            next(err);
        }
    };
}
