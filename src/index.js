const xhr = require('xhr')
const css = require('sheetify')
const querystring = require('querystring')
const mapboxgl = require('mapbox-gl/dist/mapbox-gl-dev')
const DigidemAttrib = require('@digidem/attribution-control')

const sidebarDOM = require('./sidebar')
const urls = require('../static/urls.json')

if (process.env.NODE_ENV === 'production') {
  require('./service-worker')
  var prefetched = localStorage.getItem('prefetched-waorani-assets')
  try {
    prefetched = JSON.parse(prefetched || '[]')
  } catch (err) {
    prefetched = []
  }
  // only grab ones we've not prefetched previously
  localStorage.setItem('prefetched-waorani-assets', JSON.stringify(urls))
  urls.forEach(function (url) {
    if (prefetched.indexOf(url) === -1) {
      console.log('fetching', url)
      xhr(url, function (err, resp, body) {
        if (err) console.error(err)
      })
    }
  })
}
var data = {}
var dataIndex = {}
var qs = querystring.parse(window.location.search.replace('?', ''))
var lang = qs.lang || 'es'

css('mapbox-gl/dist/mapbox-gl.css')
css('alianza-elements/style.css')

// var qs = querystring.parse(window.location.search.replace('?', ''))
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'
var defaultCenter = [ -79.656232, -0.489971 ]

var map = window.map = new mapboxgl.Map({
  container: 'map',
  center: defaultCenter,
  zoom: 6,
  style: 'mapbox://styles/aliya/cjgowcgqq00a62spkeo922ik6?fresh=true',
  hash: false,
  zoomControl: false,
  attributionControl: false,
  scrollZoom: false,
  boxZoom: false,
  doubleClickZoom: false,
  interactive: false,
  logoPosition: 'top-right'
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
  id: 'bing',
  type: 'raster',
  source: 'bing',
  layout: {
  },
  paint: {
  }
}

map.once('style.load', function () {
  map.addSource('bing', bingSource)
  map.addLayer(bing, 'territory-outline')
})

map.addControl(new DigidemAttrib(), 'bottom-right')
map.addControl(new mapboxgl.ScaleControl(), 'bottom-right')
map.addControl(new mapboxgl.AttributionControl({compact: true}), 'bottom-right')

document.body.appendChild(sidebarDOM(map))
