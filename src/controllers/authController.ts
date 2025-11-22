import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '90d',
    });
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                name: name || null,
                phone: phone || null,
            },
        });

        const token = signToken(newUser.id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    phone: newUser.phone,
                    role: newUser.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        const token = signToken(user.id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
