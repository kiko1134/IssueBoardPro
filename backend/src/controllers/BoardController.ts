import { Request, Response } from 'express';
import db from '../db/models';

const { Board } = db;

export default class BoardController {
  /** GET /api/boards — list all boards */
  static async index(req: Request, res: Response): Promise<Response> {
    try {
      const boards = await Board.findAll();
      return res.json(boards);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch boards' });
    }
  }

  /** POST /api/boards — create a new board */
  static async store(req: Request, res: Response): Promise<Response> {
    const { projectId, name, description } = req.body;
    if (!projectId || !name || !description) {
      return res.status(400).json({ message: 'projectId, name, and description are required' });
    }

    try {
      const board = await Board.create({ projectId, name, description });
      return res.status(201).json(board);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create board' });
    }
  }
}
