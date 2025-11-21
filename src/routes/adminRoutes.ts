import express from 'express';
import {
    getAllUsers,
    getUserDetails,
    toggleUserStatus,
    changeUserRole,
    deleteUser,
    getSystemStats
} from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// System statistics
router.get('/stats', getSystemStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.patch('/users/:id/change-role', changeUserRole);
router.delete('/users/:id', deleteUser);

export default router;
