import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { sendResponse } from '../utils/response';

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            sendResponse(res, 401, false, 'Unauthorized');
            return;
        }
        if (req.user.role !== role) {
            sendResponse(res, 403, false, 'Forbidden: Insufficient permissions');
            return;
        }
        next();
    };
};
