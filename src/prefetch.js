/* global caches,fetch */

var debug = function () {}
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('mapa-waorani:prefetch')
}

var urls = require('../static/urls.json')
var config = require('../mapbox-config')
var MAX_CONNECTIONS = 5

module.exports = prefetch

function prefetch (map) {
  var toFetch
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.ready.then(() => caches.keys())
    .then(keys => keys.find(k => k.indexOf('workbox-runtime') === 0))
    .then(getUrlsInCache)
    .then(urlsInCache => {
      toFetch = urls.filter(function (url, i) {
        return urlsInCache.indexOf(url) === -1
      })
      debug('tiles to prefetch:', toFetch.length)
      downloadTiles()
    }).catch(error => console.error(error))
  } else {
    urls = window.urls = []
    map.on('dataloading', function (e) {
      if (!(e.tile && e.tile.tileID)) return
      var url = getUrl(e.tile.tileID.canonical, e.source)
      urls.push(url)
    })
  }

  function downloadTiles () {
    if (!toFetch.length) return debug('Finished prefetch')
    // Only download when the map has finished loading tiles
    if (!map.areTilesLoaded()) return map.once('sourcedata', downloadTiles)
    var urls = toFetch.splice(0, Math.min(toFetch.length, MAX_CONNECTIONS))
    debug('prefetching ' + urls.length + ' tiles')
    Promise.all(urls.map(url => fetch(url)))
      .then(downloadTiles)
      .catch(error => {
        console.error(error)
        downloadTiles()
      })
  }
}

function getUrl (canonicalTileID, source) {
  if (source.tiles) return canonicalTileID.url(source.tiles)
  var urls = ['a', 'b'].map(s => {
    return source.url
      .replace('mapbox://', 'https://' + s + '.tiles.mapbox.com/v4/') +
      '/{z}/{x}/{y}.vector.pbf?access_token=' + config.accessToken
  })
  return canonicalTileID.url(urls)
}

function getUrlsInCache (cacheName) {
  return caches.open(cacheName)
    .then(cache => cache.keys())
    .then(keys => keys.map(k => k.url))
}
