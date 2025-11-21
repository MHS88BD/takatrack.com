import express from 'express';
import {
    getAllTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats
} from '../controllers/newTransactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/stats', getTransactionStats);

router.route('/')
    .get(getAllTransactions)
    .post(createTransaction);

router.route('/:id')
    .get(getTransaction)
    .put(updateTransaction)
    .delete(deleteTransaction);

export default router;
