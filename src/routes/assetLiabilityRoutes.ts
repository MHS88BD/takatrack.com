import express from 'express';
import {
    getAllAssetsLiabilities,
    createAssetLiability,
    updateAssetLiability,
    deleteAssetLiability,
    getNetWorth,
} from '../controllers/assetLiabilityController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllAssetsLiabilities)
    .post(createAssetLiability);

router.get('/net-worth', getNetWorth);

router.route('/:id')
    .put(updateAssetLiability)
    .delete(deleteAssetLiability);

export default router;
