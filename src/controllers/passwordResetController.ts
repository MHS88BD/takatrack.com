import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Request password reset
export const requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { emailOrPhone } = req.body;

        if (!emailOrPhone) {
            return next(new AppError('Please provide email or phone number', 400));
        }

        // Find user by email or phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrPhone },
                    { phone: emailOrPhone }
                ]
            }
        });

        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({
                status: 'success',
                message: 'If the account exists, a reset token has been generated'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expiration to 1 hour from now
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        // Delete any existing unused tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: {
                user_id: user.id,
                used: false
            }
        });

        // Create new reset token
        await prisma.passwordResetToken.create({
            data: {
                user_id: user.id,
                token: hashedToken,
                expires_at: expiresAt
            }
        });

        // Log token to console (for admin to provide to user)
        console.log('\n========================================');
        console.log('PASSWORD RESET REQUEST');
        console.log('========================================');
        console.log(`User: ${user.email}`);
        console.log(`Phone: ${user.phone || 'N/A'}`);
        console.log(`Reset Token: ${resetToken}`);
        console.log(`Expires: ${expiresAt.toLocaleString()}`);
        console.log('========================================\n');

        res.status(200).json({
            status: 'success',
            message: 'Reset token has been generated. Please check with administrator.'
        });
    } catch (error) {
        next(error);
    }
};

// Verify reset token
export const verifyResetToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.body;

        if (!token) {
            return next(new AppError('Please provide reset token', 400));
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                token: hashedToken,
                used: false,
                expires_at: {
                    gt: new Date()
                }
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });

        if (!resetToken) {
            return next(new AppError('Invalid or expired reset token', 400));
        }

        res.status(200).json({
            status: 'success',
            data: {
                valid: true,
                email: resetToken.user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return next(new AppError('Please provide token and new password', 400));
        }

        if (newPassword.length < 6) {
            return next(new AppError('Password must be at least 6 characters', 400));
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                token: hashedToken,
                used: false,
                expires_at: {
                    gt: new Date()
                }
            }
        });

        if (!resetToken) {
            return next(new AppError('Invalid or expired reset token', 400));
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user password
        await prisma.user.update({
            where: { id: resetToken.user_id },
            data: { password_hash: hashedPassword }
        });

        // Mark token as used
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true }
        });

        console.log(`\n[PASSWORD RESET] User ${resetToken.user_id} successfully reset their password\n`);

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        next(error);
    }
};
