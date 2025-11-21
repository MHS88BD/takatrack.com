import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

// Get all loans
export const getAllLoans = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type, status } = req.query;

        const where: any = { user_id: req.user.id };
        if (type) where.type = type;
        if (status) where.status = status;

        const loans = await prisma.loan.findMany({
            where,
            include: {
                party: true,
                transactions: {
                    orderBy: { date: 'desc' },
                    include: { wallet: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        // Calculate remaining amount dynamically
        const loansWithBalance = loans.map(loan => {
            const totalPaid = loan.transactions
                .filter(t => t.type.includes('REPAYMENT'))
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const remaining = Number(loan.amount) - totalPaid;

            return {
                ...loan,
                remaining_amount: remaining,
                total_paid: totalPaid
            };
        });

        res.status(200).json({
            status: 'success',
            results: loansWithBalance.length,
            data: { loans: loansWithBalance }
        });
    } catch (error) {
        next(error);
    }
};

// Get single loan
export const getLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const loan = await prisma.loan.findUnique({
            where: { id },
            include: {
                party: true,
                transactions: {
                    orderBy: { date: 'desc' },
                    include: { wallet: true }
                }
            }
        });

        if (!loan || loan.user_id !== req.user.id) {
            return next(new AppError('Loan not found', 404));
        }

        const totalPaid = loan.transactions
            .filter(t => t.type.includes('REPAYMENT'))
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const remaining = Number(loan.amount) - totalPaid;

        res.status(200).json({
            status: 'success',
            data: {
                loan: {
                    ...loan,
                    remaining_amount: remaining,
                    total_paid: totalPaid
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Create loan
export const createLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, type, date, party_name, party_phone, party_email, wallet_id, description } = req.body;

        if (!amount || !type || !party_name || !wallet_id) {
            return next(new AppError('Please provide amount, type, party_name, and wallet_id', 400));
        }

        // 1. Find or Create Party
        let party = await prisma.party.findFirst({
            where: { name: party_name, user_id: req.user.id }
        });

        if (!party) {
            // If creating a new party, phone and email are required
            if (!party_phone || !party_email) {
                return next(new AppError('Phone and Email are required to create a new party', 400));
            }

            // Check if phone or email already exists for another party
            const existingPartyByPhone = await prisma.party.findFirst({
                where: { phone: party_phone, user_id: req.user.id }
            });
            if (existingPartyByPhone) {
                return next(new AppError('A party with this phone number already exists', 400));
            }

            const existingPartyByEmail = await prisma.party.findFirst({
                where: { email: party_email, user_id: req.user.id }
            });
            if (existingPartyByEmail) {
                return next(new AppError('A party with this email already exists', 400));
            }

            party = await prisma.party.create({
                data: {
                    name: party_name,
                    phone: party_phone,
                    email: party_email,
                    user_id: req.user.id
                }
            });
        }

        // 2. Create Loan
        // type: LENT (I gave money), BORROWED (I received money)
        const loan = await prisma.loan.create({
            data: {
                amount: Number(amount),
                type,
                date: date ? new Date(date) : new Date(),
                party_id: party.id,
                user_id: req.user.id,
                status: 'ACTIVE'
            }
        });

        // 3. Create Initial Loan Transaction
        // If LENT -> GIVEN (Money out of wallet)
        // If BORROWED -> RECEIVED (Money into wallet)
        const transactionType = type === 'LENT' ? 'GIVEN' : 'RECEIVED';

        await prisma.loanTransaction.create({
            data: {
                loan_id: loan.id,
                party_id: party.id,
                wallet_id,
                amount: Number(amount),
                type: transactionType,
                date: date ? new Date(date) : new Date(),
                description: description || 'Initial Loan Amount'
            }
        });

        // 4. Update Wallet Balance
        const wallet = await prisma.wallet.findUnique({ where: { id: wallet_id } });
        if (wallet) {
            const newBalance = transactionType === 'RECEIVED'
                ? Number(wallet.balance) + Number(amount) // Borrowed money comes in
                : Number(wallet.balance) - Number(amount); // Lent money goes out

            await prisma.wallet.update({
                where: { id: wallet_id },
                data: { balance: newBalance }
            });
        }

        res.status(201).json({
            status: 'success',
            data: { loan }
        });
    } catch (error) {
        next(error);
    }
};

// Add Payment (Repayment)
export const addPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { loan_id } = req.params;
        const { amount, date, wallet_id, description } = req.body;

        if (!amount || !wallet_id) {
            return next(new AppError('Please provide amount and wallet_id', 400));
        }

        const loan = await prisma.loan.findUnique({ where: { id: loan_id } });

        if (!loan || loan.user_id !== req.user.id) {
            return next(new AppError('Loan not found', 404));
        }

        // Determine transaction type
        // If loan was LENT (I gave money), repayment is REPAYMENT_RECEIVED (Money comes back)
        // If loan was BORROWED (I took money), repayment is REPAYMENT_GIVEN (Money goes out)
        const transactionType = loan.type === 'LENT' ? 'REPAYMENT_RECEIVED' : 'REPAYMENT_GIVEN';

        const payment = await prisma.loanTransaction.create({
            data: {
                loan_id,
                party_id: loan.party_id,
                wallet_id,
                amount: Number(amount),
                type: transactionType,
                date: date ? new Date(date) : new Date(),
                description: description || 'Loan Repayment'
            }
        });

        // Update Wallet Balance
        const wallet = await prisma.wallet.findUnique({ where: { id: wallet_id } });
        if (wallet) {
            const newBalance = transactionType === 'REPAYMENT_RECEIVED'
                ? Number(wallet.balance) + Number(amount) // Money comes back
                : Number(wallet.balance) - Number(amount); // Money goes out

            await prisma.wallet.update({
                where: { id: wallet_id },
                data: { balance: newBalance }
            });
        }

        // Check if loan is fully paid
        const allTransactions = await prisma.loanTransaction.findMany({
            where: { loan_id }
        });

        const totalPaid = allTransactions
            .filter(t => t.type.includes('REPAYMENT'))
            .reduce((sum, t) => sum + Number(t.amount), 0);

        if (totalPaid >= Number(loan.amount)) {
            await prisma.loan.update({
                where: { id: loan_id },
                data: { status: 'PAID' }
            });
        }

        res.status(201).json({
            status: 'success',
            data: { payment }
        });
    } catch (error) {
        next(error);
    }
};
