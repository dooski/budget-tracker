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

const CACHE_NAME = "main-cache"
const DATA_CACHE_NAME = "data-cache"

//installs service worker
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting()
})

//processes api requests to either the api or cache, depending on connection
self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log(err))
        );
        return;
    }
    //updates cache
    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            return response || fetch(evt.request);
        })
    );
})