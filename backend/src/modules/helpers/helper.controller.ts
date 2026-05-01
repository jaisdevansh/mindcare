import { Request, Response, NextFunction } from 'express';
import { Helper } from './helper.model';
import { ChatSession } from '../chat/chatSession.model';
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
 
export const getHelperDashboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const helperId = req.user.id;
        
        // 1. Fetch Helper Stats
        const helper = await Helper.findById(helperId);
        if (!helper) {
            sendResponse(res, 404, false, 'Helper not found');
            return;
        }

        // 2. Fetch Incoming Requests (Human sessions with no helper yet)
        const incomingRequests = await ChatSession.find({ 
            type: 'human', 
            helperId: null, 
            status: 'pending' 
        }).sort({ createdAt: -1 }).populate('userId', 'name');

        // 3. Fetch Active Conversations for this helper
        const activeConversations = await ChatSession.find({ 
            helperId: helper._id, 
            status: 'active' 
        }).populate('userId', 'name');

        // 4. Fetch Rating/Feedback (Simulated for now, could be real aggregation)
        const stats = {
            incomingCount: incomingRequests.length,
            activeCount: activeConversations.length,
            rating: helper.rating || 5.0,
            totalSessions: helper.totalSessions || 0
        };

        sendResponse(res, 200, true, 'Dashboard data fetched', {
            stats,
            incomingRequests,
            activeConversations
        });
    } catch (error) {
        next(error);
    }
};

export const acceptRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { sessionId } = req.params;
        const helperId = req.user.id;

        const session = await ChatSession.findOne({ _id: sessionId, helperId: null });
        if (!session) {
            sendResponse(res, 404, false, 'Request not available or already taken');
            return;
        }

        session.helperId = helperId as any;
        session.status = 'active';
        await session.save();

        // Increment helper's session count
        await Helper.findByIdAndUpdate(helperId, { $inc: { totalSessions: 1 } });

        sendResponse(res, 200, true, 'Request accepted', session);
    } catch (error) {
        next(error);
    }
};
