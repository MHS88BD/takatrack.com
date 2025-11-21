import express from 'express';
import {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
} from '../controllers/transactionCategoryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

// Category routes
router.route('/')
    .get(getAllCategories)
    .post(createCategory);

router.route('/:id')
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory);

// Subcategory routes
router.post('/subcategories', createSubCategory);
router.put('/subcategories/:id', updateSubCategory);
router.delete('/subcategories/:id', deleteSubCategory);

export default router;
