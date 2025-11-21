import express from 'express';
import { getAllParties, createParty, updateParty } from '../controllers/partyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllParties)
    .post(createParty);

router.route('/:id')
    .put(updateParty);

export default router;
