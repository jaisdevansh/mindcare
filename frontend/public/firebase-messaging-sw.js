importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCGbmIDcepm7cE2r_PXeLcCTTP4i8X-twg",
    authDomain: "mindcare-f61d3.firebaseapp.com",
    projectId: "mindcare-f61d3",
    storageBucket: "mindcare-f61d3.firebasestorage.app",
    messagingSenderId: "624029557214",
    appId: "1:624029557214:web:71119e52e08f30e9e27d4f"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || 'MindCare Notification';
    const notificationOptions = {
        body: payload.notification?.body,
        icon: '/images/avatar.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
