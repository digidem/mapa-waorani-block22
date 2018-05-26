var mapboxgl = require('mapbox-gl')
var css = require('sheetify')
const config = require('../mapbox-config')
var html = require('nanohtml')
var mapTransition = require('./map_transition')

css('mapbox-gl/dist/mapbox-gl.css')

mapboxgl.accessToken = config.accessToken

var mapDiv = html`<div style="position:absolute; top:0; bottom:0; width:100%;" />`
document.body.appendChild(mapDiv)
document.body.style.margin = 0

var map = window.map = new mapboxgl.Map({
  container: mapDiv,
  style: config.style,
  zoomControl: false,
  attributionControl: false,
  logoPosition: 'bottom-right'
})

const bingSource = {
  type: 'raster',
  tiles: [
    'https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869',
    'https://ecn.t1.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869',
    'https://ecn.t2.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869',
    'https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869'
  ],
  minzoom: 1,
  maxzoom: 8,
  tileSize: 256
}

const bing = {
  id: 'bing-satellite',
  type: 'raster',
  source: 'bing',
  layout: {
  },
  paint: {
  }
}

map.once('styledata', function () {
  map.addSource('bing', bingSource)
  map.addLayer(bing, 'territory-outline')
  map.setLayoutProperty('background', 'visibility', 'none')
  map.setPaintProperty('background', 'background-opacity', 0)
  mapTransition('start', map)
})

window.mapTransition = (viewId) => new Promise((resolve, reject) => {
  mapTransition(viewId, map, {duration: 0})
  process.nextTick(onload)
  function onload () {
    if (!map.areTilesLoaded()) return map.once('sourcedata', onload)
    // Additional wait for map layer transition to complete
    setTimeout(resolve, 3000)
  }
})
