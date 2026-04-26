import { Notification } from './notification.model';

export const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'assessment' | 'payment' | 'community' | 'system' | 'helper' = 'system',
    link?: string
) => {
    return Notification.create({ userId, title, message, type, read: false, link });
};
