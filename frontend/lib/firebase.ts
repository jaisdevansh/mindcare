import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCGbmIDcepm7cE2r_PXeLcCTTP4i8X-twg",
  authDomain: "mindcare-f61d3.firebaseapp.com",
  projectId: "mindcare-f61d3",
  storageBucket: "mindcare-f61d3.firebasestorage.app",
  messagingSenderId: "624029557214",
  appId: "1:624029557214:web:71119e52e08f30e9e27d4f",
  measurementId: "G-283J751VS8"
};

// Initialize Firebase only once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics if supported (only runs in browser)
export const analytics = typeof window !== 'undefined' ? 
    isAnalyticsSupported().then(yes => yes ? getAnalytics(app) : null) : null;

// Initialize Messaging if supported (only runs in browser and if supported)
export const messaging = async () => {
    if (typeof window !== 'undefined') {
        const supported = await isMessagingSupported();
        if (supported) {
            return getMessaging(app);
        }
    }
    return null;
};
