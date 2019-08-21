const CACHE_NAME_STYLE = 'test-css-v2';
const CACHE_NAME_SCRIPT = 'test-js-v2';
const CACHE_NAME_IMAGE = 'test-img-v2';
const CACHE_NAME_DOCUMENT = 'test-route-v2';
const CACHE_NAME_FONT = 'test-font-v1';
const CACHE_NAME_DATA = 'test-data-v1';
const cacheNames = {
  script: CACHE_NAME_SCRIPT,
  style: CACHE_NAME_STYLE,
  image: CACHE_NAME_IMAGE,
  document: CACHE_NAME_DOCUMENT,
  font: CACHE_NAME_FONT,
  data: CACHE_NAME_DATA
};

const dataCachePaths = ['/todos', '/posts', '/data/user.json']
const prefetchDocuments = ['/profile']

var cacheWhitelist = Object.keys(cacheNames).map(key => cacheNames[key]);

// var appRequest = new Request('/profile', { credentials: 'include' });

self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('installing…');
  // event.waitUntil(
  //   self.skipWaiting().then(function() {
  //       caches.open(CACHE_NAME_DOCUMENT).then(function(cache) {
  //           return cache.addAll([appRequest]);
  //       })
  //   })
// );
});

self.addEventListener('activate', function (event) {
  console.log('activating…');
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
        self.clients.claim()
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  // console.log('[fetch event for assets]', event.request)
  const isOnline = navigator.onLine;
  const requestURL = new URL(event.request.url);
  const destination = event.request.destination;
  const pathname = requestURL.pathname;
  const dataPointer = dataCachePaths.includes(pathname) && 'data';
  const prefetchDocumentPointer = prefetchDocuments.includes(pathname) && 'document'
  // console.log('url', requestURL);
  // console.log('destination', destination)
  // console.log('pathname', pathname)
  // console.log('dataPointer', dataPointer)

  event.respondWith(
    caches.match(event.request)
      .then(function (cached) {

        // console.log('event.request', event.request)

        if (cached) {
          if (!dataPointer) {
            return cached;
          } else if (dataPointer && !isOnline) {
            return cached;
          }
        }

        return fetch(event.request)
          .then(function (response) {

            // console.log('response', response);

            if (!response || response.status !== 200) {
              return response;
            }

            if (response.type === 'basic') {
              const pointer = destination || dataPointer || prefetchDocumentPointer

              if (!pointer in cacheNames) {
                return response;
              }

              const responseToCache = response.clone();

              caches.open(cacheNames[pointer])
                .then(function (cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            } else if (dataPointer) {
              if (!dataPointer in cacheNames) {
                return response;
              }

              const responseToCache = response.clone();

              caches.open(cacheNames[dataPointer])
                .then(function (cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            } else {
              return response;
            }
          }
          ).catch(console.error);
      })
  );
});


