import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

export const getAllParties = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parties = await prisma.party.findMany({
            where: { user_id: req.user.id },
            include: { loans: true },
        });

        res.status(200).json({
            status: 'success',
            results: parties.length,
            data: { parties },
        });
    } catch (error) {
        next(error);
    }
};

export const createParty = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, phone, email } = req.body;

        if (!name || !phone || !email) {
            return next(new AppError('Please provide party name, phone, and email', 400));
        }

        const newParty = await prisma.party.create({
            data: {
                name,
                phone,
                email,
                user_id: req.user.id,
            },
        });

        res.status(201).json({
            status: 'success',
            data: { party: newParty },
        });
    } catch (error) {
        next(error);
    }
};

export const updateParty = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, phone, email } = req.body;

        const party = await prisma.party.findUnique({
            where: { id },
        });

        if (!party || party.user_id !== req.user.id) {
            return next(new AppError('Party not found', 404));
        }

        const updatedParty = await prisma.party.update({
            where: { id },
            data: { name, phone, email },
        });

        res.status(200).json({
            status: 'success',
            data: { party: updatedParty },
        });
    } catch (error) {
        next(error);
    }
};
