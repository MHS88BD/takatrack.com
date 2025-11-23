import express from 'express';
import { requestPasswordReset, verifyResetToken, resetPassword } from '../controllers/passwordResetController';

const router = express.Router();

router.post('/forgot-password', requestPasswordReset);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

export default router;
