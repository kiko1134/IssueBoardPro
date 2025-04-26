import { Request, Response } from 'express';
import db from '../db/models';

const { Issue, User, Project, Status } = db;

export default class IssueController {
  /** GET /api/issues — list all issues */
  static async index(req: Request, res: Response): Promise<Response> {
    try {
      const issues = await Issue.findAll({
        include: [
          { model: User, as: 'AssignedTo', attributes: ['id', 'username', 'email'] },
          { model: User, as: 'ReportedBy', attributes: ['id', 'username', 'email'] },
          { model: Project, attributes: ['id', 'name'] },
          { model: Status, attributes: ['id', 'name'] }
        ]
      });
      return res.json(issues);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch issues' });
    }
  }

  /** GET /api/issues/:id — get single issue by id */
  static async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const issue = await Issue.findByPk(id, {
        include: [
          { model: User, as: 'AssignedTo', attributes: ['id', 'username'] },
          { model: User, as: 'ReportedBy', attributes: ['id', 'username'] },
          { model: Project, attributes: ['id', 'name'] },
          { model: Status, attributes: ['id', 'name'] }
        ]
      });
      if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      return res.json(issue);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch issue' });
    }
  }

  /** POST /api/issues — create a new issue */
  static async store(req: Request, res: Response): Promise<Response> {
    const { title, description, projectId, assignedTo, assignedBy, statusId } = req.body;
    if (!title || !description || !projectId) {
      return res.status(400).json({ message: 'title, description, and projectId are required' });
    }
    try {
      const issue = await Issue.create({
        title,
        description,
        projectId,
        assignedTo: assignedTo || null,
        assignedBy: assignedBy || null,
        statusId: statusId || null
      });
      return res.status(201).json(issue);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create issue' });
    }
  }

  /** PUT /api/issues/:id — update an issue */
  static async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updates = req.body;
    try {
      const issue = await Issue.findByPk(id);
      if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      await issue.update(updates);
      return res.json(issue);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update issue' });
    }
  }

  /** DELETE /api/issues/:id — delete an issue */
  static async destroy(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const deleted = await Issue.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      return res.json({ message: 'Issue deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to delete issue' });
    }
  }
}