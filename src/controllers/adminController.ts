import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

// Get all users (Admin only)
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                is_active: true,
                created_at: true,
                _count: {
                    select: {
                        transactions: true,
                        wallets: true,
                        loans: true,
                        parties: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

// Get single user details (Admin only)
export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
                transactions: {
                    select: {
                        id: true,
                        amount: true,
                        date: true,
                        type: true,
                        description: true
                    },
                    orderBy: { date: 'desc' },
                    take: 10
                },
                wallets: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        balance: true
                    }
                },
                loans: {
                    select: {
                        id: true,
                        type: true,
                        amount: true,
                        status: true,
                        party: {
                            select: { name: true }
                        }
                    }
                },
                _count: {
                    select: {
                        transactions: true,
                        wallets: true,
                        loans: true,
                        parties: true,
                        transactionCategories: true,
                        assetLiabilities: true
                    }
                }
            }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// Toggle user active status (Admin only)
export const toggleUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (user.role === 'ADMIN') {
            return next(new AppError('Cannot deactivate admin users', 400));
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { is_active: !user.is_active },
            select: {
                id: true,
                email: true,
                is_active: true
            }
        });

        res.status(200).json({
            status: 'success',
            message: `User ${updatedUser.is_active ? 'activated' : 'deactivated'}`,
            data: { user: updatedUser }
        });
    } catch (error) {
        next(error);
    }
};

// Change user role (Admin only)
export const changeUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['USER', 'ADMIN'].includes(role)) {
            return next(new AppError('Invalid role. Must be USER or ADMIN', 400));
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                role: true
            }
        });

        res.status(200).json({
            status: 'success',
            message: `User role changed to ${role}`,
            data: { user: updatedUser }
        });
    } catch (error) {
        next(error);
    }
};

// Delete user (Admin only)
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (user.role === 'ADMIN') {
            return next(new AppError('Cannot delete admin users', 400));
        }

        // Delete user and all related data (cascade)
        await prisma.user.delete({
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

// Get system statistics (Admin only)
export const getSystemStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalTransactions,
            totalWallets,
            totalLoans,
            totalParties
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { is_active: true } }),
            prisma.transaction.count(),
            prisma.wallet.count(),
            prisma.loan.count(),
            prisma.party.count()
        ]);

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                email: true,
                created_at: true,
                is_active: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalUsers,
                    activeUsers,
                    inactiveUsers: totalUsers - activeUsers,
                    totalTransactions,
                    totalWallets,
                    totalLoans,
                    totalParties
                },
                recentUsers
            }
        });
    } catch (error) {
        next(error);
    }
};
