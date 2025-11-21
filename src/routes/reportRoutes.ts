import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getMonthlyStats, getCategoryStats } from '../controllers/reportController';

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlyStats);
router.get('/category', getCategoryStats);

export default router;
