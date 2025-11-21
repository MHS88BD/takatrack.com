import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

// Get all transaction categories for current user
export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type } = req.query; // INCOME or EXPENSE

        const where: any = { user_id: req.user.id };
        if (type && (type === 'INCOME' || type === 'EXPENSE')) {
            where.type = type;
        }

        const categories = await prisma.transactionCategory.findMany({
            where,
            include: {
                subCategories: true,
                _count: {
                    select: { transactions: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: { categories }
        });
    } catch (error) {
        next(error);
    }
};

// Get single category
export const getCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const category = await prisma.transactionCategory.findUnique({
            where: { id },
            include: {
                subCategories: true,
                transactions: {
                    take: 10,
                    orderBy: { date: 'desc' }
                }
            }
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

// Create category
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

        if (!['INCOME', 'EXPENSE'].includes(type)) {
            return next(new AppError('Type must be INCOME or EXPENSE', 400));
        }

        const newCategory = await prisma.transactionCategory.create({
            data: {
                name,
                type,
                user_id: req.user.id
            },
            include: {
                subCategories: true
            }
        });

        res.status(201).json({
            status: 'success',
            data: { category: newCategory }
        });
    } catch (error) {
        next(error);
    }
};

// Update category
export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, type } = req.body;

        const category = await prisma.transactionCategory.findUnique({
            where: { id }
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        const updatedCategory = await prisma.transactionCategory.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(type && { type })
            },
            include: {
                subCategories: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: { category: updatedCategory }
        });
    } catch (error) {
        next(error);
    }
};

// Delete category
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const category = await prisma.transactionCategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { transactions: true }
                }
            }
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        if (category._count.transactions > 0) {
            return next(new AppError('Cannot delete category with existing transactions', 400));
        }

        await prisma.transactionCategory.delete({
            where: { id }
        });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

// Create subcategory
export const createSubCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { category_id, name } = req.body;

        if (!category_id || !name) {
            return next(new AppError('Please provide category_id and name', 400));
        }

        const category = await prisma.transactionCategory.findUnique({
            where: { id: category_id }
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        const subCategory = await prisma.transactionSubCategory.create({
            data: {
                name,
                category_id
            }
        });

        res.status(201).json({
            status: 'success',
            data: { subCategory }
        });
    } catch (error) {
        next(error);
    }
};

// Update subcategory
export const updateSubCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const subCategory = await prisma.transactionSubCategory.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!subCategory || subCategory.category.user_id !== req.user.id) {
            return next(new AppError('Subcategory not found', 404));
        }

        const updatedSubCategory = await prisma.transactionSubCategory.update({
            where: { id },
            data: { name }
        });

        res.status(200).json({
            status: 'success',
            data: { subCategory: updatedSubCategory }
        });
    } catch (error) {
        next(error);
    }
};

// Delete subcategory
export const deleteSubCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const subCategory = await prisma.transactionSubCategory.findUnique({
            where: { id },
            include: {
                category: true,
                _count: {
                    select: { transactions: true }
                }
            }
        });

        if (!subCategory || subCategory.category.user_id !== req.user.id) {
            return next(new AppError('Subcategory not found', 404));
        }

        if (subCategory._count.transactions > 0) {
            return next(new AppError('Cannot delete subcategory with existing transactions', 400));
        }

        await prisma.transactionSubCategory.delete({
            where: { id }
        });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
