import { Request, Response } from 'express';
import db from '../db/models';

const { Project } = db;

export default class ProjectController {
  /** GET /api/projects — list all projects */
  static async index(req: Request, res: Response): Promise<Response> {
    try {
      const projects = await Project.findAll();
      return res.json(projects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch projects' });
    }
  }

  /** POST /api/projects — create a new project */
  static async store(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'name and description are required' });
    }

    try {
      const project = await Project.create({ name, description });
      return res.status(201).json(project);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create project' });
    }
  }
}
