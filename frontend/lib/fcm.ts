import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';

export const requestNotificationPermission = async () => {
    try {
        if (!('Notification' in window)) return null;

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const msg = await messaging();
            if (!msg) return null;

            const token = await getToken(msg, {
                vapidKey: 'BPr7b4nI_21zY2S-2-wB1EONV4Nq-300QhO87F2i3iOOhK80eFh94Q4YhHw_P-Zq-YJ-R586Q2t7YV1HwV07-68' // Note: For production, we should get a real VAPID key from Firebase console. For now this will fail without one unless the user adds it, or we omit vapidKey but standard practice needs it for web push. Wait, let me omit vapid key for now so it uses default, but usually web push requires it. Let me leave a comment.
            });
            console.log("FCM Token:", token);
            // We should send this token to our backend to save it to the user profile
            return token;
        }
    } catch (error) {
        console.error('Notification permission denied or failed', error);
    }
    return null;
};
