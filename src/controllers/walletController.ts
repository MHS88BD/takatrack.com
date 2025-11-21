import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

// Get all wallets for current user
export const getAllWallets = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const wallets = await prisma.wallet.findMany({
            where: { user_id: req.user.id },
            orderBy: { created_at: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: wallets.length,
            data: { wallets }
        });
    } catch (error) {
        next(error);
    }
};

// Get single wallet
export const getWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const wallet = await prisma.wallet.findUnique({
            where: { id },
            include: {
                transactions: {
                    take: 10,
                    orderBy: { date: 'desc' }
                },
                loanTransactions: {
                    take: 10,
                    orderBy: { date: 'desc' }
                }
            }
        });

        if (!wallet || wallet.user_id !== req.user.id) {
            return next(new AppError('Wallet not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { wallet }
        });
    } catch (error) {
        next(error);
    }
};

// Create wallet
export const createWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, type, balance } = req.body;

        if (!name || !type) {
            return next(new AppError('Please provide name and type', 400));
        }

        if (!['BANK', 'CASH', 'CREDIT_CARD'].includes(type)) {
            return next(new AppError('Type must be BANK, CASH, or CREDIT_CARD', 400));
        }

        const newWallet = await prisma.wallet.create({
            data: {
                name,
                type,
                balance: balance || 0,
                user_id: req.user.id
            }
        });

        res.status(201).json({
            status: 'success',
            data: { wallet: newWallet }
        });
    } catch (error) {
        next(error);
    }
};

// Update wallet
export const updateWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, type, balance } = req.body;

        const wallet = await prisma.wallet.findUnique({
            where: { id }
        });

        if (!wallet || wallet.user_id !== req.user.id) {
            return next(new AppError('Wallet not found', 404));
        }

        const updatedWallet = await prisma.wallet.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(type && { type }),
                ...(balance !== undefined && { balance })
            }
        });

        res.status(200).json({
            status: 'success',
            data: { wallet: updatedWallet }
        });
    } catch (error) {
        next(error);
    }
};

// Delete wallet
export const deleteWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const wallet = await prisma.wallet.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        transactions: true,
                        loanTransactions: true
                    }
                }
            }
        });

        if (!wallet || wallet.user_id !== req.user.id) {
            return next(new AppError('Wallet not found', 404));
        }

        if (wallet._count.transactions > 0 || wallet._count.loanTransactions > 0) {
            return next(new AppError('Cannot delete wallet with existing transactions', 400));
        }

        await prisma.wallet.delete({
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

// Get wallet balance
export const getWalletBalance = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const wallet = await prisma.wallet.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                type: true,
                balance: true,
                user_id: true
            }
        });

        if (!wallet || wallet.user_id !== req.user.id) {
            return next(new AppError('Wallet not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { wallet: { id: wallet.id, name: wallet.name, type: wallet.type, balance: wallet.balance } }
        });
    } catch (error) {
        next(error);
    }
};

// Get all wallets summary
export const getWalletsSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const wallets = await prisma.wallet.findMany({
            where: { user_id: req.user.id }
        });

        const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);
        const bankBalance = wallets
            .filter(w => w.type === 'BANK')
            .reduce((sum, wallet) => sum + Number(wallet.balance), 0);
        const cashBalance = wallets
            .filter(w => w.type === 'CASH')
            .reduce((sum, wallet) => sum + Number(wallet.balance), 0);
        const creditBalance = wallets
            .filter(w => w.type === 'CREDIT_CARD')
            .reduce((sum, wallet) => sum + Number(wallet.balance), 0);

        res.status(200).json({
            status: 'success',
            data: {
                totalWallets: wallets.length,
                totalBalance,
                bankBalance,
                cashBalance,
                creditBalance,
                wallets
            }
        });
    } catch (error) {
        next(error);
    }
};
