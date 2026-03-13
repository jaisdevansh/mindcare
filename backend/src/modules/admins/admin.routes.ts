import { Router } from 'express';
import { getDashboardInfo, getAllUsers, toggleUserStatus, deleteUser, updateUserDetails } from './admin.controller';
import { getAllApplications, approveApplication, rejectApplication } from '../helpers/helperApplication.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.get('/dashboard', authenticate, requireRole('admin'), getDashboardInfo);
router.get('/users', authenticate, requireRole('admin'), getAllUsers);
router.put('/users/:id/toggle-status', authenticate, requireRole('admin'), toggleUserStatus);
router.delete('/users/:id', authenticate, requireRole('admin'), deleteUser);
router.patch('/users/:id', authenticate, requireRole('admin'), updateUserDetails);

// Helper Application Management
router.get('/applications', authenticate, requireRole('admin'), getAllApplications);
router.put('/applications/:id/approve', authenticate, requireRole('admin'), approveApplication);
router.put('/applications/:id/reject', authenticate, requireRole('admin'), rejectApplication);

export default router;
