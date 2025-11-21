import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

export const getAllTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type, category_id, startDate, endDate } = req.query;

        const where: any = { user_id: req.user.id };

        if (type) where.type = type;
        if (category_id) where.category_id = category_id;
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string),
            };
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                category: true,
                subCategory: true,
                tags: true,
            },
            orderBy: { date: 'desc' },
        });

        res.status(200).json({
            status: 'success',
            results: transactions.length,
            data: { transactions },
        });
    } catch (error) {
        next(error);
    }
};

export const createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, date, description, type, category_id, sub_category_id, tags } = req.body;

        if (!amount || !date || !type || !category_id) {
            return next(new AppError('Please provide amount, date, type, and category_id', 400));
        }

        const transactionData: any = {
            amount,
            date: new Date(date),
            description,
            type,
            category_id,
            user_id: req.user.id,
        };

        if (sub_category_id) transactionData.sub_category_id = sub_category_id;

        if (tags && tags.length > 0) {
            transactionData.tags = {
                connect: tags.map((tagId: string) => ({ id: tagId })),
            };
        }

        const newTransaction = await prisma.transaction.create({
            data: transactionData,
            include: { tags: true },
        });

        res.status(201).json({
            status: 'success',
            data: { transaction: newTransaction },
        });
    } catch (error) {
        next(error);
    }
};

export const getTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: {
                category: true,
                subCategory: true,
                tags: true,
            },
        });

        if (!transaction || transaction.user_id !== req.user.id) {
            return next(new AppError('Transaction not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { transaction },
        });
    } catch (error) {
        next(error);
    }
};

export const updateTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { amount, date, description, type, category_id, sub_category_id, tags } = req.body;

        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction || transaction.user_id !== req.user.id) {
            return next(new AppError('Transaction not found', 404));
        }

        const updateData: any = {
            amount,
            date: date ? new Date(date) : undefined,
            description,
            type,
            category_id,
            sub_category_id,
        };

        if (tags) {
            updateData.tags = {
                set: tags.map((tagId: string) => ({ id: tagId })),
            };
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: updateData,
            include: { tags: true },
        });

        res.status(200).json({
            status: 'success',
            data: { transaction: updatedTransaction },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction || transaction.user_id !== req.user.id) {
            return next(new AppError('Transaction not found', 404));
        }

        await prisma.transaction.delete({
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
