import { Router } from 'express';
import { getProfile, updateProfile, uploadProfileImage, changePassword, upload } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All routes are protected by JWT authentication
router.get('/profile', authenticate, getProfile);
router.put('/update-profile', authenticate, updateProfile);
router.post('/upload-profile-image', authenticate, upload.single('profileImage'), uploadProfileImage);
router.put('/change-password', authenticate, changePassword);

export default router;
