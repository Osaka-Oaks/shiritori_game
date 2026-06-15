// Firebase Cloud Messaging Service Worker
// This handles background notifications when the app is not in focus

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAOr3y32r7OG1EfX6728LRK4hR7rHV7x_k",
  authDomain: "shiritori-game-ccaae.firebaseapp.com",
  databaseURL: "https://shiritori-game-ccaae-default-rtdb.firebaseio.com",
  projectId: "shiritori-game-ccaae",
  storageBucket: "shiritori-game-ccaae.firebasestorage.app",
  messagingSenderId: "324507601155",
  appId: "1:324507601155:web:d69804f7cf3dba96ec4136",
  measurementId: "G-9X4LT2R6CJ"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Shiritori Game';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'shiritori-notification',
    requireInteraction: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);
  
  event.notification.close();
  
  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already an open window
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // No window open, open a new one
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
