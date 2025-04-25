import { Request, Response } from 'express';
import db from '../db/models';

const { Comment } = db;

export default class CommentController {
  /** GET /api/comments/:issueId — get all comments for an issue */
  static async index(req: Request, res: Response): Promise<Response> {
    const { issueId } = req.params;
    try {
      const comments = await Comment.findAll({ where: { issueId } });
      return res.json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch comments' });
    }
  }

  /** POST /api/comments — create a new comment */
  static async store(req: Request, res: Response): Promise<Response> {
    const { issueId, content } = req.body;
    if (!issueId || !content) {
      return res.status(400).json({ message: 'issueId and content are required' });
    }

    try {
      const comment = await Comment.create({ issueId, content });
      return res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create comment' });
    }
  }
}
