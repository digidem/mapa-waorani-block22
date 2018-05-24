/* global importScripts,workbox */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js')

workbox.skipWaiting()
workbox.clientsClaim()

// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.silent)

// map tiles
workbox.routing.registerRoute(
  /https:\/\/[abcd]\.tiles\.mapbox\.com|https:\/\/ecn\.t\d\.tiles\.virtualearth\.net/,
  new workbox.strategies.CacheFirst()
)

workbox.routing.registerRoute(
  /https:\/\/resizer.digital-democracy.org/,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

// The sources, style.json and sprites
workbox.routing.registerRoute(
  /https:\/\/api\.mapbox\.com\/(styles|v4)/,
  new workbox.strategies.StaleWhileRevalidate({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

// The font glyphs
workbox.routing.registerRoute(
  /https:\/\/api\.mapbox\.com\/fonts/,
  new workbox.strategies.CacheFirst()
)

// Mapbox js & css
workbox.routing.registerRoute(
  /https:\/\/api\.tiles\.mapbox\.com\/mapbox-gl-js/,
  new workbox.strategies.CacheFirst()
)

// Polyfill
workbox.routing.registerRoute(
  /https:\/\/polyfill\.io\/v2/,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

workbox.precaching.precacheAndRoute([])
