import { apiFetch } from '../api';

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'assessment' | 'payment' | 'community' | 'system' | 'helper';
    read: boolean;
    link?: string;
    createdAt: string;
}

export const notificationService = {
    getNotifications: async () => {
        return await apiFetch('/notifications', { method: 'GET' });
    },
    markAsRead: async (id: string) => {
        return await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    },
    markAllAsRead: async () => {
        return await apiFetch('/notifications/read-all', { method: 'PATCH' });
    },
    deleteNotification: async (id: string) => {
        return await apiFetch(`/notifications/${id}`, { method: 'DELETE' });
    }
};
