// src/middleware/authMiddleware.ts
import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload as DefaultJwtPayload} from 'jsonwebtoken';

interface JwtPayload extends DefaultJwtPayload {
    id: number;
    username: string;
}

// Extend Express’s Request type so TS knows about `req.user`
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const token = req.cookies?.access_token;
    console.log("authenticateJWT",token);
    if (!token) {
        res.status(401).json({ message: 'Missing authentication token' });
        return;
    }

    try {
        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET!,
        ) as JwtPayload;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
