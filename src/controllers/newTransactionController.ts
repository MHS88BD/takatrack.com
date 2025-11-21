import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';
import { Decimal } from '@prisma/client/runtime/library';

// Get all transactions for current user
export const getAllTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type, category_id, wallet_id, start_date, end_date } = req.query;

        const where: any = { user_id: req.user.id };

        if (type && (type === 'INCOME' || type === 'EXPENSE')) {
            where.type = type;
        }

        if (category_id) {
            where.category_id = category_id as string;
        }

        if (wallet_id) {
            where.wallet_id = wallet_id as string;
        }

        if (start_date || end_date) {
            where.date = {};
            if (start_date) where.date.gte = new Date(start_date as string);
            if (end_date) where.date.lte = new Date(end_date as string);
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                category: {
                    select: { id: true, name: true, type: true }
                },
                subCategory: {
                    select: { id: true, name: true }
                },
                wallet: {
                    select: { id: true, name: true, type: true }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: transactions.length,
            data: { transactions }
        });
    } catch (error) {
        next(error);
    }
};

// Get single transaction
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
                wallet: true
            }
        });

        if (!transaction || transaction.user_id !== req.user.id) {
            return next(new AppError('Transaction not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { transaction }
        });
    } catch (error) {
        next(error);
    }
};

// Create transaction
export const createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, date, description, type, category_id, sub_category_id, wallet_id } = req.body;

        // Validation
        if (!amount || !date || !type || !category_id || !wallet_id) {
            return next(new AppError('Please provide amount, date, type, category_id, and wallet_id', 400));
        }

        if (!['INCOME', 'EXPENSE'].includes(type)) {
            return next(new AppError('Type must be INCOME or EXPENSE', 400));
        }

        // Verify category belongs to user
        const category = await prisma.transactionCategory.findUnique({
            where: { id: category_id }
        });

        if (!category || category.user_id !== req.user.id) {
            return next(new AppError('Category not found', 404));
        }

        // Verify category type matches transaction type
        if (category.type !== type) {
            return next(new AppError(`Category type (${category.type}) must match transaction type (${type})`, 400));
        }

        // Verify wallet belongs to user
        const wallet = await prisma.wallet.findUnique({
            where: { id: wallet_id }
        });

        if (!wallet || wallet.user_id !== req.user.id) {
            return next(new AppError('Wallet not found', 404));
        }

        // Verify subcategory if provided
        if (sub_category_id) {
            const subCategory = await prisma.transactionSubCategory.findUnique({
                where: { id: sub_category_id },
                include: { category: true }
            });

            if (!subCategory || subCategory.category_id !== category_id) {
                return next(new AppError('Subcategory not found or does not belong to category', 404));
            }
        }

        // Create transaction and update wallet balance in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create transaction
            const newTransaction = await tx.transaction.create({
                data: {
                    amount: new Decimal(amount),
                    date: new Date(date),
                    description,
                    type,
                    category_id,
                    sub_category_id: sub_category_id || null,
                    wallet_id,
                    user_id: req.user.id
                },
                include: {
                    category: true,
                    subCategory: true,
                    wallet: true
                }
            });

            // Update wallet balance
            const balanceChange = type === 'INCOME' ? Number(amount) : -Number(amount);
            await tx.wallet.update({
                where: { id: wallet_id },
                data: {
                    balance: {
                        increment: balanceChange
                    }
                }
            });

            return newTransaction;
        });

        res.status(201).json({
            status: 'success',
            data: { transaction: result }
        });
    } catch (error) {
        next(error);
    }
};

// Update transaction
export const updateTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { amount, date, description, type, category_id, sub_category_id } = req.body;

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: { wallet: true }
        });

        if (!transaction || transaction.user_id !== req.user.id) {
            return next(new AppError('Transaction not found', 404));
        }

        // If amount or type is changing, we need to update wallet balance
        const isAmountChanging = amount && Number(amount) !== Number(transaction.amount);
        const isTypeChanging = type && type !== transaction.type;

        if (isAmountChanging || isTypeChanging) {
            // Revert old transaction effect
            const oldEffect = transaction.type === 'INCOME' ? -Number(transaction.amount) : Number(transaction.amount);

            // Apply new transaction effect
            const newType = type || transaction.type;
            const newAmount = amount || Number(transaction.amount);
            const newEffect = newType === 'INCOME' ? Number(newAmount) : -Number(newAmount);

            const totalChange = oldEffect + newEffect;

            await prisma.$transaction(async (tx) => {
                // Update transaction
                await tx.transaction.update({
                    where: { id },
                    data: {
                        ...(amount && { amount: new Decimal(amount) }),
                        ...(date && { date: new Date(date) }),
                        ...(description !== undefined && { description }),
                        ...(type && { type }),
                        ...(category_id && { category_id }),
                        ...(sub_category_id !== undefined && { sub_category_id })
                    }
                });

                // Update wallet balance
                await tx.wallet.update({
                    where: { id: transaction.wallet_id },
                    data: {
                        balance: {
                            increment: totalChange
                        }
                    }
                });
            });
        } else {
            // Just update transaction without wallet balance change
            await prisma.transaction.update({
                where: { id },
                data: {
                    ...(date && { date: new Date(date) }),
                    ...(description !== undefined && { description }),
                    ...(category_id && { category_id }),
                    ...(sub_category_id !== undefined && { sub_category_id })
                }
            });
        }

        const updatedTransaction = await prisma.transaction.findUnique({
            where: { id },
            include: {
                category: true,
                subCategory: true,
                wallet: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: { transaction: updatedTransaction }
        });
    } catch (error) {
        next(error);
    }
};

// Delete transaction
export const deleteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const transaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!transaction || transaction.user_id !== req.user.id) {
            return next(new AppError('Transaction not found', 404));
        }

        // Delete transaction and revert wallet balance
        await prisma.$transaction(async (tx) => {
            // Revert wallet balance
            const balanceChange = transaction.type === 'INCOME' ? -Number(transaction.amount) : Number(transaction.amount);
            await tx.wallet.update({
                where: { id: transaction.wallet_id },
                data: {
                    balance: {
                        increment: balanceChange
                    }
                }
            });

            // Delete transaction
            await tx.transaction.delete({
                where: { id }
            });
        });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

// Get transaction statistics
export const getTransactionStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { start_date, end_date } = req.query;

        const where: any = { user_id: req.user.id };

        if (start_date || end_date) {
            where.date = {};
            if (start_date) where.date.gte = new Date(start_date as string);
            if (end_date) where.date.lte = new Date(end_date as string);
        }

        const [incomeTransactions, expenseTransactions] = await Promise.all([
            prisma.transaction.findMany({
                where: { ...where, type: 'INCOME' }
            }),
            prisma.transaction.findMany({
                where: { ...where, type: 'EXPENSE' }
            })
        ]);

        const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const balance = totalIncome - totalExpense;

        res.status(200).json({
            status: 'success',
            data: {
                totalIncome,
                totalExpense,
                balance,
                incomeCount: incomeTransactions.length,
                expenseCount: expenseTransactions.length,
                totalTransactions: incomeTransactions.length + expenseTransactions.length
            }
        });
    } catch (error) {
        next(error);
    }
};
