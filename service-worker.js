'use strict';
const CACHE_NAME = 'ollies-learning-shell-v6';
const FILES = ['./', './index.html', './styles.css', './app.js', './subjects/math.js', './subjects/english.js',
  './subjects/science.js', './subjects/coding.js', './pet.js', './pet-owl.svg', './pet-cat.svg', './pet-dragon.svg', './pet-egg.svg', './pet-kitten.svg',
  './activity-adventure.svg', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
const urls = new Set(FILES.map(path => new URL(path,self.registration.scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('ollies-learning-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  const navigation = request.mode === 'navigate';
  if (!navigation && !urls.has(url.href)) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(navigation ? new URL('./index.html',self.registration.scope).href : request,copy)));
    }
    return response;
  }).catch(async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(navigation ? new URL('./index.html',self.registration.scope).href : request)) || Response.error();
  }));
});