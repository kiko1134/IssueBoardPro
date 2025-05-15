import {RequestHandler} from 'express';
import db from '../db/models';

const {Project, User} = db;

export default class ProjectController {
    /** GET /api/projects — list projects assigned to me */
    static index: RequestHandler = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const user = await User.findByPk(userId);
            if (!user) {
                res.status(404).json({message: 'User not found'});
                return;
            }

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
        const {name, description} = req.body;
        if (!name || !description) {
            res.status(400).json({message: 'name and description are required'});
            return;
        }

        try {
            const project = await Project.create({name, description});
            const userId = req.user!.id;
            await project.addAssignedUser(userId); // Assign the project to the user
            res.status(201).json(project);
        } catch (err) {
            console.error(err);
            next(err);
            return;
        }
    };

    /** GET /api/projects/:id/members — list members */
    static members: RequestHandler = async (req, res, next) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (!project)
                res.status(404).json({message: "Project not found"});
            const members = await project.getAssignedUsers({
                attributes: ["id", "username", "email"],
            });
            res.json(members);
        } catch (err) {
            next(err);
        }
    };

    /** POST /api/projects/:id/members — add a member by email */
    static addMember: RequestHandler = async (req, res, next) => {
        try {
            const user = await User.findOne({where: {email: req.body.email}});
            if (!user) res.status(404).json({message: "User not found"});
            const project = await Project.findByPk(req.params.id);
            if (!project)
                res.status(404).json({message: "Project not found"});
            await project.addAssignedUser(user.id);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    };
}
