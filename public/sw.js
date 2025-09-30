// Basic service worker
const CACHE_NAME = 'weather-app-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle all fetch requests normally
  return;
});
