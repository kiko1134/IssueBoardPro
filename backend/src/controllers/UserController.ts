import {RequestHandler} from 'express';
import bcrypt from 'bcrypt';
import db from '../db/models';
import jwt from 'jsonwebtoken';

const {User} = db;

export default class UserController {

    /** GET /api/users — list all users */
    static index: RequestHandler = async (req, res, next) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
            });
            res.json(users);
        } catch (error) {
            next(error);
            console.error(error);
            res.status(500).json({message: 'Failed to fetch users'});
        }
    };

    /** GET /api/users/:id — get single user by id */
    static show: RequestHandler = async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id, { /*…*/});
            if (!user) {
                res.status(404).json({message: 'User not found'});
                return;                 // you can `return;` to stop execution
            }
            res.json(user);
        } catch (err) {
            next(err);
        }
    };

    /** POST /api/users — create a new user */
    static store: RequestHandler = async (req, res, next) => {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            res.status(400).json({message: 'username, email and password are required'});
            return;
        }

        try {
            const exists = await User.findOne({where: {email}});
            if (exists) {
                res.status(409).json({message: 'Email already in use'});
                return;
            }

            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({username, email, password: hash});

            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email
            });
        } catch (error) {
            next(error);
        }
    };

    /** POST /api/users/login — authenticate user */
    static login: RequestHandler = async (req, res, next) => {
        const {email, password} = req.body;
        if (!email || !password) {
            res.status(400).json({message: 'email and password are required'});
            return;
        }

        try {
            const user = await User.findOne({where: {email}});
            if (!user) {
                res.status(401).json({message: 'Invalid credentials'});
                return;
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                res.status(401).json({message: 'Invalid credentials'});
                return;
            }

            const token = jwt.sign(
                {id: user.id, username: user.username},
                process.env.JWT_SECRET || 'default-secret',
                {expiresIn: '15m'}
            );

            res.json({token, username: user.username});
        } catch (error) {
            next(error);
        }
    };

    /** DELETE /api/users/:id — delete a user */
    static destroy: RequestHandler = async (req, res, next) => {
        const {id} = req.params;

        try {
            const deleted = await User.destroy({where: {id}});
            if (!deleted) {
                res.status(404).json({message: 'User not found'});
                return;
            }

            res.json({message: 'User deleted'});
        } catch (error) {
            next(error);
        }
    };
}