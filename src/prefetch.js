/* global caches,fetch,mapboxgl */

var debug = require('debug')('mapa-waorani:prefetch')

var urls = require('../static/urls.json')
var MAX_CONNECTIONS = 5

module.exports = prefetch

function prefetch (map) {
  var toFetch
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.ready.then(() => Promise.all([
      getUrlsInCache('mapbox-tile-cache'),
      getUrlsInCache('bing-tile-cache')
    ])).then(values => {
      var prefetched = values[0].concat(values[1])
      toFetch = urls.filter(function (url, i) {
        return prefetched.indexOf(url) === -1
      })
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
      '/{z}/{x}/{y}.vector.pbf?access_token=' + mapboxgl.accessToken
  })
  return canonicalTileID.url(urls)
}

function getUrlsInCache (cacheName) {
  return caches.open(cacheName)
    .then(cache => cache.keys())
    .then(keys => keys.map(k => k.url))
}
