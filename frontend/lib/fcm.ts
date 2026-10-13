import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';

export const requestNotificationPermission = async () => {
    try {
        if (typeof window === 'undefined' || !('Notification' in window)) return null;

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const msg = await messaging();
            if (!msg) return null;

            try {
                const token = await getToken(msg, {
                    vapidKey: 'BPr7b4nI_21zY2S-2-wB1EONV4Nq-300QhO87F2i3iOOhK80eFh94Q4YhHw_P-Zq-YJ-R586Q2t7YV1HwV07-68'
                });
                console.log("FCM Token:", token);
                return token;
            } catch (err: any) {
                // Gracefully ignore invalid Firebase/VAPID keys in development
                console.warn('Firebase notification setup skipped:', err?.message || err);
                return null;
            }
        }
    } catch (error: any) {
        console.warn('Notification permission or FCM setup warning:', error?.message || error);
    }
    return null;
};
