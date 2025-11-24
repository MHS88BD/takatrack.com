import express from 'express';
import { requestPasswordReset, verifyResetToken, resetPassword } from '../controllers/passwordResetController';

const router = express.Router();

router.post('/forgot-password', requestPasswordReset as any);
router.post('/verify-reset-token', verifyResetToken as any);
router.post('/reset-password', resetPassword as any);

export default router;
