// public/push-sw.js
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Tienes una nueva actualización',
    icon: '/icon.png', // Reemplaza con la ruta del logo de tu PWA
    badge: '/icon.png',
    data: data.url || '/', // URL a la que irá al hacer clic
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Asociación Básquetbol', options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});