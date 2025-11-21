import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

export const getAllTags = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tags = await prisma.tag.findMany({
            where: { user_id: req.user.id },
        });

        res.status(200).json({
            status: 'success',
            results: tags.length,
            data: { tags },
        });
    } catch (error) {
        next(error);
    }
};

export const createTag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name } = req.body;

        if (!name) {
            return next(new AppError('Please provide tag name', 400));
        }

        const newTag = await prisma.tag.create({
            data: {
                name,
                user_id: req.user.id,
            },
        });

        res.status(201).json({
            status: 'success',
            data: { tag: newTag },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!tag || tag.user_id !== req.user.id) {
            return next(new AppError('Tag not found', 404));
        }

        await prisma.tag.delete({
            where: { id },
        });

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
