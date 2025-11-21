import express from 'express';
import {
    getAllWallets,
    getWallet,
    createWallet,
    updateWallet,
    deleteWallet,
    getWalletBalance,
    getWalletsSummary
} from '../controllers/walletController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/summary', getWalletsSummary);

router.route('/')
    .get(getAllWallets)
    .post(createWallet);

router.route('/:id')
    .get(getWallet)
    .put(updateWallet)
    .delete(deleteWallet);

router.get('/:id/balance', getWalletBalance);

export default router;
