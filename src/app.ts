import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Taka Track API is running' });
});

import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import transactionCategoryRoutes from './routes/transactionCategoryRoutes';
import newTransactionRoutes from './routes/newTransactionRoutes';
import loanRoutes from './routes/loanRoutes';
import reportRoutes from './routes/reportRoutes';
import exportRoutes from './routes/exportRoutes';
// OLD ROUTES - Disabled
// import categoryRoutes from './routes/categoryRoutes'; // OLD SCHEMA - Disabled
// import tagRoutes from './routes/tagRoutes'; // OLD SCHEMA - Disabled
// import transactionRoutes from './routes/transactionRoutes'; // OLD SCHEMA - Disabled
// import partyRoutes from './routes/partyRoutes'; // OLD SCHEMA - Disabled
// import loanRoutes from './routes/loanRoutes'; // OLD SCHEMA - Disabled
// import assetLiabilityRoutes from './routes/assetLiabilityRoutes'; // OLD SCHEMA - Disabled
import adminRoutes from './routes/adminRoutes'; // Temporarily disabled
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

// NEW ROUTES - Working with new schema
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/transaction-categories', transactionCategoryRoutes);
app.use('/api/v1/transactions', newTransactionRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/export', exportRoutes);

// OLD ROUTES TEMPORARILY DISABLED - Will rewrite for new schema
// app.use('/api/v1/categories', categoryRoutes);
// app.use('/api/v1/tags', tagRoutes);
// app.use('/api/v1/transactions', transactionRoutes);
// app.use('/api/v1/parties', partyRoutes);
// app.use('/api/v1/loans', loanRoutes);
// app.use('/api/v1/assets-liabilities', assetLiabilityRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
