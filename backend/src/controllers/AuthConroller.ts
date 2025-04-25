import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/models';

const { User } = db;

export default class AuthController {
  /** POST /api/auth/register — register a new user */
  static async register(req: Request, res: Response): Promise<Response> {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    try {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hash });
      return res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to register user' });
    }
  }

  /** POST /api/auth/login — authenticate user */
  static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET as string || 'default-secret',
        { expiresIn: '1h' }
      );
      return res.json({ token, username: user.username });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Login failed' });
    }
  }
}
