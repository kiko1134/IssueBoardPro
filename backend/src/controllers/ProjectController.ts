import {RequestHandler} from 'express';
import db from '../db/models';

const { Project,User } = db;

export default class ProjectController {
  /** GET /api/projects — list projects assigned to me */
  static index: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Fetch projects via the belongsToMany association
      const projects = await user.getAssignedProjects({
        order: [['name', 'ASC']],
      });

      res.json(projects);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  /** POST /api/projects — create a new project */
  static store: RequestHandler = async (req, res, next) => {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ message: 'name and description are required' });
      return;
    }

    try {
      const project = await Project.create({ name, description });
      const userId = req.user!.id;
      await project.addAssignedUser(userId); // Assign the project to the user
      res.status(201).json(project);
      // return;
    } catch (err) {
      console.error(err);
      next(err);
      return;
    }
  };
}
