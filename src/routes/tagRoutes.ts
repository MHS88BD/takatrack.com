import express from 'express';
import { getAllTags, createTag, deleteTag } from '../controllers/tagController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllTags)
    .post(createTag);

router.route('/:id')
    .delete(deleteTag);

export default router;
