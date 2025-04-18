// backend/src/routes/user.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db/models';

const router = Router();

// GET /api/users
router.get('/', async (_req: Request, res: Response) => {
    const users = await db.User.findAll({
        attributes: ['id','username','email','createdAt']
    });
    res.json(users);
});

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({ username, email, password: hash });
    res.status(201).json({ id: user.id, username, email });
});

export default router;
