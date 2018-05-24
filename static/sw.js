/* global importScripts,workbox */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js')

workbox.skipWaiting()
workbox.clientsClaim()

workbox.routing.registerRoute(
  /https:\/\/[abcd]\.tiles\.mapbox\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'mapbox-tile-cache'
  })
)

workbox.routing.registerRoute(
  /https:\/\/ecn\.t\d\.tiles\.virtualearth\.net/,
  new workbox.strategies.CacheFirst({
    cacheName: 'bing-tile-cache'
  })
)

workbox.routing.registerRoute(
  /https:\/\/resizer.digital-democracy.org/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images'
  })
)

workbox.precaching.precacheAndRoute([])
