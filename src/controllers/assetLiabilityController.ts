import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { AppError } from '../utils/AppError';

export const getAllAssetsLiabilities = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type } = req.query;

        const where: any = { user_id: req.user.id };
        if (type) where.type = type;

        const items = await prisma.assetLiability.findMany({
            where,
            include: { tags: true },
        });

        res.status(200).json({
            status: 'success',
            results: items.length,
            data: { items },
        });
    } catch (error) {
        next(error);
    }
};

export const createAssetLiability = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, type, value, category, tags } = req.body;

        if (!name || !type || !value || !category) {
            return next(new AppError('Please provide name, type, value, and category', 400));
        }

        const data: any = {
            name,
            type,
            value,
            category,
            user_id: req.user.id,
        };

        if (tags && tags.length > 0) {
            data.tags = {
                connect: tags.map((tagId: string) => ({ id: tagId })),
            };
        }

        const newItem = await prisma.assetLiability.create({
            data,
            include: { tags: true },
        });

        res.status(201).json({
            status: 'success',
            data: { item: newItem },
        });
    } catch (error) {
        next(error);
    }
};

export const updateAssetLiability = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, type, value, category, tags } = req.body;

        const item = await prisma.assetLiability.findUnique({
            where: { id },
        });

        if (!item || item.user_id !== req.user.id) {
            return next(new AppError('Item not found', 404));
        }

        const updateData: any = {
            name,
            type,
            value,
            category,
        };

        if (tags) {
            updateData.tags = {
                set: tags.map((tagId: string) => ({ id: tagId })),
            };
        }

        const updatedItem = await prisma.assetLiability.update({
            where: { id },
            data: updateData,
            include: { tags: true },
        });

        res.status(200).json({
            status: 'success',
            data: { item: updatedItem },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAssetLiability = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const item = await prisma.assetLiability.findUnique({
            where: { id },
        });

        if (!item || item.user_id !== req.user.id) {
            return next(new AppError('Item not found', 404));
        }

        await prisma.assetLiability.delete({
            where: { id },
        });

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const getNetWorth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const items = await prisma.assetLiability.findMany({
            where: { user_id: req.user.id },
        });

        let totalAssets = 0;
        let totalLiabilities = 0;

        // Assuming 'loans' is a subset of 'items' or another data source
        // For the purpose of this edit, we'll assume 'items' can be treated as 'loans'
        // and apply the new logic. If 'loans' is a separate entity, this change
        // would require more context.
        items.forEach((item: any) => {
            if (item.type === 'ASSET') {
                totalAssets += Number(item.value);
            } else {
                totalLiabilities += Number(item.value);
            }
        });

        const netWorth = totalAssets - totalLiabilities;

        res.status(200).json({
            status: 'success',
            data: {
                totalAssets,
                totalLiabilities,
                netWorth,
            },
        });
    } catch (error) {
        next(error);
    }
};
