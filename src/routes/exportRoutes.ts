import express from 'express';
import {
    exportTransactionsCSV,
    exportWalletsCSV,
    exportLoansCSV,
    exportCategoriesCSV,
    exportTransactionsPDF,
    exportWalletsPDF,
    exportLoansPDF,
    exportFinancialReportPDF,
} from '../controllers/exportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// CSV Export Routes
router.get('/csv/transactions', protect, exportTransactionsCSV);
router.get('/csv/wallets', protect, exportWalletsCSV);
router.get('/csv/loans', protect, exportLoansCSV);
router.get('/csv/categories', protect, exportCategoriesCSV);

// PDF Export Routes
router.get('/pdf/transactions', protect, exportTransactionsPDF);
router.get('/pdf/wallets', protect, exportWalletsPDF);
router.get('/pdf/loans', protect, exportLoansPDF);
router.get('/pdf/financial-report', protect, exportFinancialReportPDF);

export default router;
