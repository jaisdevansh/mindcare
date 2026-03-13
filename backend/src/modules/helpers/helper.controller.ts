import { Request, Response, NextFunction } from 'express';
import { Helper } from './helper.model';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getHelperProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const helperId = req.user.id;
        const helper = await Helper.findById(helperId).select('-password');
        if (!helper) {
            sendResponse(res, 404, false, 'Helper not found');
            return;
        }
        sendResponse(res, 200, true, 'Helper profile fetched', helper);
    } catch (error) {
        next(error);
    }
};

export const getAllHelpers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const helpers = await Helper.find({ verified: true }).select('-password');
        sendResponse(res, 200, true, 'All helpers fetched', helpers);
    } catch (error) {
        next(error);
    }
};
