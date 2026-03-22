const CACHE_NAME = 'kitchen-app-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './logo.png',
    './manifest.json'
];

// Install the service worker and save the files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Serve saved files when the app is opened
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
