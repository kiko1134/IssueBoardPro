import {RequestHandler} from 'express';
import db from '../db/models';

const {Issue, WorkLog, User, Sequelize} = db;


export default class WorklogController {

    /** GET /api/issues/:id/worklog — total minutes on one issue */
    static getIssueWorklog: RequestHandler = async (req, res, next) => {
        try {
            const issueId = Number(req.params.id);
            const issue = await Issue.findByPk(issueId);
            if (!issue) {
                res.status(404).json({message: "Issue not found"});
            }

            const totalMinutes = await WorkLog.sum("minutes", {
                where: {issueId},
            });

            res.json({totalMinutes: totalMinutes || 0});
        } catch (err) {
            next(err);
        }
    };


//  POST /api/issues/:id/worklog
    static logWork: RequestHandler = async (req, res, next) => {
        try {
            const issueId = Number(req.params.id);
            const issue = await Issue.findByPk(issueId);
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }

            const { minutes, userId: bodyUserId } = req.body;

            if (typeof minutes !== 'number' || minutes <= 0) {
                res.status(400).json({ message: 'Invalid minutes' });
                return;
            }

            const userId =
                typeof bodyUserId === 'number'
                    ? bodyUserId
                    : issue.assignedTo;

            if (typeof userId !== 'number') {
                res
                    .status(400)
                    .json({ message: 'Missing or invalid userId' });
                return;
            }

            await WorkLog.create({ issueId: issue.id, userId, minutes });

            const totalMinutes = await WorkLog.sum('minutes', {
                where: { issueId: issue.id },
            });

            res.json({ totalMinutes: totalMinutes || 0 });
        } catch (err) {
            next(err);
        }
    };

//  GET /api/projects/:projectId/worklogs
    static projectWorklogSummary: RequestHandler = async (req, res, next) => {
        try {
            const projectId = Number(req.params.projectId);

            // join WorkLog → Issue (to filter by project) → User
            const raw = await WorkLog.findAll({
                include: [
                    {model: Issue, where: {projectId}, attributes: []},
                    {model: User, attributes: ['id', 'username']},
                ],
                attributes: [
                    'userId',
                    [Sequelize.fn('SUM', Sequelize.col('minutes')), 'totalMinutes'],
                ],
                group: ['userId', 'User.id', 'User.username'],
            });

            const summary = raw.map((r: any) => ({
                id: r.userId,
                username: r.User.username,
                totalMinutes: Number(r.get('totalMinutes')),
            }));

            res.json(summary);
        } catch (err) {
            next(err);
        }
    };

}
