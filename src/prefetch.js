var xhr = require('xhr')
var mapboxgl = require('mapbox-gl')
var debug = require('debug')('mapa-waorani:prefetch')

var urls = require('../static/urls.json')

var localStorage = window.localStorage

module.exports = prefetch

function prefetch (map) {
  if (process.env.NODE_ENV === 'production') {
    var prefetched = localStorage.getItem('prefetched-waorani-assets')
    try {
      prefetched = JSON.parse(prefetched || '[]')
    } catch (err) {
      prefetched = []
    }
    debug('already prefetched:', prefetched)
    var toFetch = urls.filter(function (url) {
      return prefetched.indexOf(url) === -1
    })
    debug('still to fetch:', toFetch)
    downloadTile()
  } else {
    urls = window.urls = []
    map.on('sourcedata', function (e) {
      if (!(e.coord && e.tile)) return
      var url = getUrl(e.coord.canonical, e.source)
      urls.push(url)
    })
  }

  function downloadTile () {
    if (!toFetch.length) return
    if (!map.areTilesLoaded()) {
      map.once('sourcedata', downloadTile)
      return
    }
    var url = toFetch.shift()
    debug('downloading ' + url)
    xhr(url, function (err) {
      if (err) {
        console.error(err)
      } else {
        debug('downloaded ' + url)
        prefetched.push(url)
        localStorage.setItem('prefetched-waorani-assets', JSON.stringify(prefetched))
      }
      downloadTile()
    })
  }
}

var i = 0

function getUrl (tile, source) {
  var q = tileToQuadkey([tile.x, tile.y, tile.z])
  var url
  if (source.url) {
    url = source.url
  } else {
    url = source.tiles[i++ % source.tiles.length]
  }
  if (url.startsWith('mapbox://')) {
    url = url.replace('mapbox://', 'https://' + ['a', 'b'][i++ % 2] + '.tiles.mapbox.com/v4/')
    url += '/{z}/{x}/{y}.vector.pbf?access_token=' + mapboxgl.accessToken
  }
  url = url.replace('{quadkey}', q)
  url = url.replace('{z}', tile.z)
  url = url.replace('{x}', tile.x)
  url = url.replace('{y}', tile.y)
  return url
}

/**
 * Get the quadkey for a tile [x, y, z]
 *
 * @name tileToQuadkey
 * @param {Array<number>} tile [x, y, z]
 * @returns {string} quadkey
 * @example
 * var quadkey = tileToQuadkey([1, 1, 5])
 * //=quadkey
 */
function tileToQuadkey (tile) {
  var index = ''
  for (var z = tile[2]; z > 0; z--) {
    var b = 0
    var mask = 1 << (z - 1)
    if ((tile[0] & mask) !== 0) b++
    if ((tile[1] & mask) !== 0) b += 2
    index += b.toString()
  }
  return index
}
