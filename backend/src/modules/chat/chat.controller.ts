import { Response, NextFunction } from 'express';
import { ChatSession } from './chatSession.model';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export const createSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { helperId } = req.body;
        const session = await ChatSession.create({ userId: req.user.id, helperId: helperId || null });
        sendResponse(res, 201, true, 'Session created', session);
    } catch (error) {
        next(error);
    }
};

export const getSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sessions = await ChatSession.find({ userId: req.user.id }).populate('helperId', 'name');
        sendResponse(res, 200, true, 'Sessions fetched', sessions);
    } catch (error) {
        next(error);
    }
};
