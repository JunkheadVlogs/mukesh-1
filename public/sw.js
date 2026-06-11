const CACHE_NAME = 'mukeshsarees-assets-v1';

// Pre-caching core local layout items and fonts for instant rendering
const PRECACHE_ASSETS = [
  '/',
  '/fonts/fonts.css',
  '/fonts/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2',
  '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Pre-caching base fonts / files failed silently (expected on local dev):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // ONLY intercept GET requests originating from local source to bypass any tracking / Razorpay / analytics
  if (event.request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return;
  }

  // Strictly exclude API endpoint actions, order submissions, or log reports
  if (
    requestUrl.pathname.startsWith('/api') || 
    requestUrl.pathname.startsWith('/sys-') || 
    requestUrl.pathname.includes('browser-log')
  ) {
    return;
  }

  const isFont = requestUrl.pathname.match(/\.(woff2|woff|ttf|otf|eot)$/);
  const isAsset = requestUrl.pathname.match(/\.(js|css|json)$/) || requestUrl.pathname.includes('/assets/');
  const isImage = requestUrl.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/);

  if (isFont || isAsset || isImage) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Only cache perfect responses to guarantee stability
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          return cachedResponse;
        });

        // 1. Local fonts: extremely high-performance Cache-First strategy
        if (isFont && cachedResponse) {
          return cachedResponse;
        }

        // 2. Chunks & general static assets: Stale-While-Revalidate strategy
        return cachedResponse || fetchPromise;
      })
    );
  }
});
