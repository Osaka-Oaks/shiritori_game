// Firebase Cloud Messaging service worker — loads config from /firebase-config.json
// (generated at build time from VITE_FIREBASE_* env vars; never hardcode keys here).

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

fetch("/firebase-config.json")
  .then(res => (res.ok ? res.json() : null))
  .then(config => {
    if (!config || !config.apiKey) {
      console.warn("[firebase-messaging-sw] Firebase config not available — FCM disabled.");
      return;
    }

    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(payload => {
      console.log("[firebase-messaging-sw.js] Received background message:", payload);

      const notificationTitle = payload.notification?.title || "Shiritori Game";
      const notificationOptions = {
        body: payload.notification?.body || "You have a new notification",
        icon: payload.notification?.icon || "/icons/Icon-192.png",
        badge: "/icons/Icon-192.png",
        data: payload.data,
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  })
  .catch(err => {
    console.warn("[firebase-messaging-sw] Failed to load config:", err);
  });

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
