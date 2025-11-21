import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await prisma.transactionCategory.findMany({
            where: { user_id: req.user.id },
            include: { subCategories: true },
        });

        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: { categories },
        });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return next(new AppError('Please provide name and type', 400));
        }

        const newCategory = await prisma.transactionCategory.create({
            data: {
                name,
                type,
                user_id: req.user.id,
            },
        });

        res.status(201).json({
            status: 'success',
            data: { category: newCategory },
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, type } = req.body;
        const { id } = req.params;

        const category = await prisma.transactionCategory.findUnique({
            where: { id },
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        const updatedCategory = await prisma.transactionCategory.update({
            where: { id },
            data: { name, type },
        });

        res.status(200).json({
            status: 'success',
            data: { category: updatedCategory },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const category = await prisma.transactionCategory.findUnique({
            where: { id },
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        await prisma.transactionCategory.delete({
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

export const createSubCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, category_id } = req.body;

        if (!name || !category_id) {
            return next(new AppError('Please provide name and category_id', 400));
        }

        const category = await prisma.transactionCategory.findUnique({
            where: { id: category_id },
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        const newSubCategory = await prisma.transactionSubCategory.create({
            data: {
                name,
                category_id,
            },
        });

        res.status(201).json({
            status: 'success',
            data: { subCategory: newSubCategory },
        });
    } catch (error) {
        next(error);
    }
};
