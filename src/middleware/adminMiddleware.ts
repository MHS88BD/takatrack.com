import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new AppError('Not authenticated', 401));
    }

    if (req.user.role !== 'ADMIN') {
        return next(new AppError('Admin access required', 403));
    }

    next();
};

export const requireActive = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new AppError('Not authenticated', 401));
    }

    if (!req.user.is_active) {
        return next(new AppError('Account is deactivated. Contact admin.', 403));
    }

    next();
};
