console.log("connected")

const FILES_TO_CACHE = [
    "/",
    "index.html",
    "index.js",
    "service-worker.js",
    "styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]

const CACHE_NAME = "application_cache"

self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting()
})