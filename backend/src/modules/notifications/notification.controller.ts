import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendResponse } from '../../utils/response';
import { Notification } from './notification.model';

// GET /notifications — fetch user's notifications (latest 20)
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });
        sendResponse(res, 200, true, 'Notifications fetched', { notifications, unreadCount });
    } catch (error) { next(error); }
};

// PATCH /notifications/:id/read — mark one as read
export const markRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { read: true });
        sendResponse(res, 200, true, 'Marked as read');
    } catch (error) { next(error); }
};

// PATCH /notifications/read-all — mark all as read
export const markAllRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
        sendResponse(res, 200, true, 'All notifications marked as read');
    } catch (error) { next(error); }
};

// DELETE /notifications/:id — delete one
export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        sendResponse(res, 200, true, 'Notification deleted');
    } catch (error) { next(error); }
};
