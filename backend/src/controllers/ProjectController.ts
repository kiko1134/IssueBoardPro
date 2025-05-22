import {RequestHandler} from 'express';
import db from '../db/models';

const {Project, User, Issue} = db;

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

    /** GET /api/projects/:id — fetch one project */
    static show: RequestHandler = async (req, res, next) => {
        try {
            const project = await Project.findByPk(req.params.id, {
                include: [
                    // include the admin relation so we can see adminId (and/or admin data)
                    {model: User, as: 'admin', attributes: ['id', 'username', 'email']},
                ],
                attributes: ['id', 'name', 'description', 'adminId', 'createdAt', 'updatedAt']
            });

            if (!project) {
                res.status(404).json({message: 'Project not found'});
            }

            res.json(project);
        } catch (err) {
            return next(err);
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
            // const project = await Project.create({name, description});
            // const userId = req.user!.id;
            // await project.addAssignedUser(userId); // Assign the project to the user
            // res.status(201).json(project);

            const userId = req.user!.id;
            const project = await Project.create({
                name,
                description,
                adminId: userId,
            });
            await project.addAssignedUser(userId);
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

    /** DELETE /api/projects/:id/users/:userId — remove a user from a project (admin only) */
    static removeUser: RequestHandler = async (req, res, next) => {
        try {

            const project = await Project.findByPk(req.params.id);
            if (!project) {
                res.status(404).json({message: 'Project not found'});
            }

            const currentUserId = req.user!.id;
            if (project.adminId !== currentUserId) {
                res.status(403).json({message: 'Only the project admin can remove users'});
            }

            const userIdToRemove = Number(req.params.userId);

            // 1) Remove membership
            await project.removeAssignedUser(userIdToRemove);

            // 2) Keep issue history but unassign any tasks assigned to this user
            await Issue.update(
                {assignedTo: null},
                {where: {projectId: project.id, assignedTo: userIdToRemove}}
            );

            res.status(204).send();
        } catch (err) {
            return next(err);
        }
    };

    /** PUT /api/projects/:id — update project info (admin only) */
    static update: RequestHandler = async (req, res, next) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (!project) {
                res.status(404).json({message: 'Project not found'});
            }

            const currentUserId = req.user!.id;
            if (project.adminId !== currentUserId) {
                res.status(403).json({message: 'Only the project admin can update this project'});
            }

            const {name, description} = req.body;
            if (name !== undefined) project.name = name;
            if (description !== undefined) project.description = description;

            await project.save();
            res.json(project);
        } catch (err) {
            return next(err);
        }
    };

    /** DELETE /api/projects/:id — delete a project (admin only) */
    static destroy: RequestHandler = async (req, res, next) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (!project) {
                res.status(404).json({message: 'Project not found'});
            }

            const currentUserId = req.user!.id;
            if (project.adminId !== currentUserId) {
                res.status(403).json({message: 'Only the project admin can delete this project'});
            }

            await project.destroy();
            res.status(204).send();
        } catch (err) {
            return next(err);
        }
    };
}
