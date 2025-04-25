import { Request, Response } from 'express';
import db from '../db/models';

const { Status } = db;

export default class StatusController {
  /** GET /api/statuses — list all statuses */
  static async index(req: Request, res: Response): Promise<Response> {
    try {
      const statuses = await Status.findAll();
      return res.json(statuses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch statuses' });
    }
  }

  /** POST /api/statuses — create a new status */
  static async store(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    try {
      const status = await Status.create({ name });
      return res.status(201).json(status);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create status' });
    }
  }
}
