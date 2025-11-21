import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateTransactionsCSV, generateWalletsCSV, generateLoansCSV, generateCategoriesCSV } from '../utils/csvExport';
import { generateTransactionsPDF, generateWalletsPDF, generateLoansPDF, generateFinancialReportPDF } from '../utils/pdfExport';

const prisma = new PrismaClient();

// CSV Exports
export const exportTransactionsCSV = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { startDate, endDate } = req.query;

        const whereClause: any = { user_id: userId };

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date.gte = new Date(startDate as string);
            if (endDate) whereClause.date.lte = new Date(endDate as string);
        }

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            include: {
                category: { select: { name: true } },
                wallet: { select: { name: true } },
            },
            orderBy: { date: 'desc' },
        });

        // Convert Decimal to number
        const transactionsData = transactions.map(t => ({
            ...t,
            amount: Number(t.amount),
            description: t.description ?? undefined,
        }));

        const csv = generateTransactionsCSV(transactionsData);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting transactions CSV:', error);
        res.status(500).json({ error: 'Failed to export transactions' });
    }
};

export const exportWalletsCSV = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const wallets = await prisma.wallet.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });

        // Convert Decimal to number
        const walletsData = wallets.map(w => ({
            ...w,
            balance: Number(w.balance),
        }));

        const csv = generateWalletsCSV(walletsData);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=wallets.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting wallets CSV:', error);
        res.status(500).json({ error: 'Failed to export wallets' });
    }
};

export const exportLoansCSV = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const loans = await prisma.loan.findMany({
            where: { user_id: userId },
            include: {
                party: { select: { name: true } },
            },
            orderBy: { created_at: 'desc' },
        });

        // Convert Decimal to number and add party_name
        const loansData = loans.map(l => ({
            ...l,
            amount: Number(l.amount),
            party_name: l.party.name,
            wallet: undefined, // Not in schema
            interest_rate: undefined,
            due_date: undefined,
        }));

        const csv = generateLoansCSV(loansData);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=loans.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting loans CSV:', error);
        res.status(500).json({ error: 'Failed to export loans' });
    }
};

export const exportCategoriesCSV = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const categories = await prisma.transactionCategory.findMany({
            where: { user_id: userId },
            include: {
                _count: { select: { transactions: true } },
            },
            orderBy: { name: 'asc' },
        });

        // Format categories data
        const categoriesData = categories.map(c => ({
            ...c,
            parent: undefined, // TransactionCategory doesn't have parent
        }));

        const csv = generateCategoriesCSV(categoriesData);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=categories.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting categories CSV:', error);
        res.status(500).json({ error: 'Failed to export categories' });
    }
};

// PDF Exports
export const exportTransactionsPDF = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { startDate, endDate } = req.query;

        const whereClause: any = { user_id: userId };

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date.gte = new Date(startDate as string);
            if (endDate) whereClause.date.lte = new Date(endDate as string);
        }

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            include: {
                category: { select: { name: true } },
                wallet: { select: { name: true } },
            },
            orderBy: { date: 'desc' },
        });

        // Convert Decimal to number
        const transactionsData = transactions.map(t => ({
            ...t,
            amount: Number(t.amount),
            description: t.description ?? undefined,
        }));

        generateTransactionsPDF(transactionsData, res);
    } catch (error) {
        console.error('Error exporting transactions PDF:', error);
        res.status(500).json({ error: 'Failed to export transactions' });
    }
};

export const exportWalletsPDF = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const wallets = await prisma.wallet.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });

        // Convert Decimal to number
        const walletsData = wallets.map(w => ({
            ...w,
            balance: Number(w.balance),
        }));

        generateWalletsPDF(walletsData, res);
    } catch (error) {
        console.error('Error exporting wallets PDF:', error);
        res.status(500).json({ error: 'Failed to export wallets' });
    }
};

export const exportLoansPDF = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const loans = await prisma.loan.findMany({
            where: { user_id: userId },
            include: {
                party: { select: { name: true } },
            },
            orderBy: { created_at: 'desc' },
        });

        // Convert Decimal to number and add party_name
        const loansData = loans.map(l => ({
            ...l,
            amount: Number(l.amount),
            party_name: l.party.name,
            wallet: undefined,
            interest_rate: undefined,
            due_date: undefined,
        }));

        generateLoansPDF(loansData, res);
    } catch (error) {
        console.error('Error exporting loans PDF:', error);
        res.status(500).json({ error: 'Failed to export loans' });
    }
};

export const exportFinancialReportPDF = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { startDate, endDate } = req.query;

        const whereClause: any = { user_id: userId };

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date.gte = new Date(startDate as string);
            if (endDate) whereClause.date.lte = new Date(endDate as string);
        }

        // Get all necessary data
        const [transactions, wallets, loans] = await Promise.all([
            prisma.transaction.findMany({
                where: whereClause,
                include: {
                    category: { select: { name: true } },
                    wallet: { select: { name: true } },
                },
                orderBy: { date: 'desc' },
            }),
            prisma.wallet.findMany({
                where: { user_id: userId },
            }),
            prisma.loan.findMany({
                where: { user_id: userId },
            }),
        ]);

        // Calculate totals with Decimal conversion
        const totalIncome = transactions
            .filter((t) => t.type === 'INCOME')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpense = transactions
            .filter((t) => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const netSavings = totalIncome - totalExpense;

        const totalWalletBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);

        const totalLoansLent = loans
            .filter((l) => l.type === 'LENT')
            .reduce((sum, l) => sum + Number(l.amount), 0);

        const totalLoansBorrowed = loans
            .filter((l) => l.type === 'BORROWED')
            .reduce((sum, l) => sum + Number(l.amount), 0);

        // Category breakdown
        const categoryMap = new Map<string, number>();
        transactions
            .filter((t) => t.type === 'EXPENSE')
            .forEach((t) => {
                const categoryName = t.category?.name || 'Uncategorized';
                categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + Number(t.amount));
            });

        const categoryBreakdown = Array.from(categoryMap.entries())
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
            }))
            .sort((a, b) => b.amount - a.amount);

        // Convert transactions data
        const transactionsData = transactions.map(t => ({
            ...t,
            amount: Number(t.amount),
            description: t.description ?? undefined,
        }));

        const reportData = {
            totalIncome,
            totalExpense,
            netSavings,
            totalWalletBalance,
            totalLoansLent,
            totalLoansBorrowed,
            categoryBreakdown,
            transactions: transactionsData,
        };

        generateFinancialReportPDF(reportData, res);
    } catch (error) {
        console.error('Error exporting financial report PDF:', error);
        res.status(500).json({ error: 'Failed to export financial report' });
    }
};
