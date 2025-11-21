import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';

export const getMonthlyStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const year = new Date().getFullYear();

        // Get all transactions for the current year
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id: req.user.id,
                date: {
                    gte: new Date(`${year}-01-01`),
                    lte: new Date(`${year}-12-31`)
                }
            }
        });

        const monthlyData = Array(12).fill(0).map((_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            income: 0,
            expense: 0
        }));

        transactions.forEach(t => {
            const month = new Date(t.date).getMonth();
            if (t.type === 'INCOME') {
                monthlyData[month].income += Number(t.amount);
            } else {
                monthlyData[month].expense += Number(t.amount);
            }
        });

        res.status(200).json({
            status: 'success',
            data: { monthlyData }
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoryStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type } = req.query; // INCOME or EXPENSE

        const stats = await prisma.transaction.groupBy({
            by: ['category_id'],
            where: {
                user_id: req.user.id,
                type: type as string || 'EXPENSE'
            },
            _sum: {
                amount: true
            }
        });

        // Fetch category names
        const categoryIds = stats.map(s => s.category_id);
        const categories = await prisma.transactionCategory.findMany({
            where: { id: { in: categoryIds } }
        });

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
        }, {} as any);

        const result = stats.map(s => ({
            name: categoryMap[s.category_id] || 'Unknown',
            value: Number(s._sum.amount)
        })).sort((a, b) => b.value - a.value);

        res.status(200).json({
            status: 'success',
            data: { stats: result }
        });
    } catch (error) {
        next(error);
    }
};
