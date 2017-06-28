self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
let clickUrl;
self.addEventListener('push', (event) => {
  const payload = JSON.parse(event.data.text());
  clickUrl = payload.url;
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon
    })
  );
});
self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
          if (clickUrl && 'navigate' in clientList[0]) {
              clientList[0].navigate(clickUrl);
          }
          return clientList[0].focus();
      }
      return self.clients.openWindow(clickUrl || '{DEFAULT_URL}');
    })
  );
});
