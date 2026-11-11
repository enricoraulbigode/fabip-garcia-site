// Fábio Garcia · Painel — recebe o aviso de agendamento novo mesmo com o painel fechado
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch { d = { corpo: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Fábio Garcia · Painel', {
    body: d.corpo || '', icon: '/icone-192.png', badge: '/icone-192.png', tag: d.tag || undefined, renotify: true,
    data: { url: d.url || '/admin' }, vibrate: [120, 60, 120],
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const alvo = new URL((e.notification.data && e.notification.data.url) || '/admin', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ws) => {
    for (const w of ws) if (w.url.includes('/admin')) { w.navigate(alvo); return w.focus(); }
    return self.clients.openWindow(alvo);
  }));
});
