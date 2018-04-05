module.exports = {
  'globDirectory': 'dist/',
  'globPatterns': [
    '**/*.{js,json,jpg,html,png,css}'
  ],
  'swDest': 'dist/sw.js',
  'skipWaiting': true,
  'runtimeCaching': [{
    // You can use a RegExp as the pattern:
    urlPattern: /https:\/\/api\.mapbox\.com|https:\/\/[abcd]\.tiles\.mapbox\.com|https:\/\/ecn\.t\d\.tiles\.virtualearth\.net/,
    handler: 'staleWhileRevalidate',
    // Any options provided will be used when
    // creating the caching strategy.
    options: {
      cacheName: 'map-cache',
      cacheableResponse: {statuses: [0, 200]}
    }
  }],
  'globIgnores': [
    '../workbox-cli-config.js'
  ]
}
