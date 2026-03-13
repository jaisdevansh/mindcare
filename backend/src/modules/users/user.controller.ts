import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { sendResponse } from '../../utils/response';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../../middleware/auth.middleware';

// Multer Config
// Multer Config
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const dir = './uploads/profile';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG and WebP are allowed.'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }
        sendResponse(res, 200, true, 'Profile fetched successfully', user);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);
        sendResponse(res, 200, true, 'Profile updated successfully', user);
    } catch (error) {
        next(error);
    }
};

export const uploadProfileImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const multerReq = req as any;
        if (!multerReq.file) {
            return sendResponse(res, 400, false, 'Please upload an image');
        }

        const imagePath = `/uploads/profile/${multerReq.file.filename}`;
        const user = await userService.updateProfileImage(req.user.id, imagePath);

        sendResponse(res, 200, true, 'Profile image updated successfully', {
            profileImage: imagePath,
            user
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return sendResponse(res, 400, false, 'Old and new passwords are required');
        }

        await userService.changePassword(req.user.id, oldPassword, newPassword);
        sendResponse(res, 200, true, 'Password changed successfully');
    } catch (error: any) {
        sendResponse(res, 400, false, error.message || 'Failed to change password');
    }
};
