const xhr = require('xhr')
const css = require('sheetify')
const mapboxgl = require('mapbox-gl')
const lozad = require('lozad')()
const DigidemAttrib = require('@digidem/attribution-control')

const sidebarDOM = require('./sidebar')

if (process.env.NODE_ENV === 'production') {
  require('./service-worker')
}

var data = {}
var dataIndex = {}

css('mapbox-gl/dist/mapbox-gl.css')
css('alianza-elements/style.css')

// var qs = querystring.parse(window.location.search.replace('?', ''))
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'
var defaultCenter = [ -79.656232, -0.489971 ]

var map = window.map = new mapboxgl.Map({
  container: 'map',
  center: defaultCenter,
  zoom: 8,
  maxBounds: [-87, -9, -70, 3],
  style: 'mapbox://styles/aliya/cjgowcgqq00a62spkeo922ik6?fresh=true',
  hash: false,
  zoomControl: false,
  attributionControl: false,
  scrollZoom: false,
  boxZoom: false,
  doubleClickZoom: false
})

xhr('data.json', {header: {
  'Content-Type': 'application/json'
}}, function (err, resp, body) {
  if (err) console.error(err)
  data = JSON.parse(body)
  Object.keys(data).forEach(function (key) {
    data[key].features.forEach(function (feature) {
      dataIndex[feature.properties.Preset] = feature
    })
  })
})

map.addControl(new mapboxgl.ScaleControl(), 'top-right')
map.addControl(new mapboxgl.AttributionControl({compact: true}), 'top-right')
map.addControl(new DigidemAttrib(), 'bottom-right')

map.on('style.load', function () {
  var sidebar = sidebarDOM(map, map.getStyle().layers)
  document.body.appendChild(sidebar)
  lozad.observe()
})
