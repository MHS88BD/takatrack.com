import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getAllLoans, getLoan, createLoan, addPayment } from '../controllers/loanController';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllLoans)
    .post(createLoan);

router.route('/:id')
    .get(getLoan);

router.route('/:loan_id/payments')
    .post(addPayment);

export default router;
