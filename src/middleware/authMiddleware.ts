import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

interface JwtPayload {
    id: string;
}

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access.', 401)
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            );
        }

        // Temporarily disabled - will re-enable after Prisma client update
        // if (!currentUser.is_active) {
        //     return next(
        //         new AppError(
        //             'Your account has been deactivated. Please contact admin.',
        //             403
        //         )
        //     );
        // }

        req.user = currentUser;
        next();
    } catch (error) {
        next(new AppError('Invalid token. Please log in again.', 401));
    }
};
