const xhr = require('xhr')
const css = require('sheetify')
const querystring = require('querystring')
const mapboxgl = require('mapbox-gl')
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

// xhr('data.json', {header: {
//   'Content-Type': 'application/json'
// }}, function (err, resp, body) {
//   if (err) console.error(err)
//   data = JSON.parse(body)
//   Object.keys(data).forEach(function (key) {
//     data[key].features.forEach(function (feature) {
//       dataIndex[feature.properties.Preset] = feature
//     })
//   })
// })

map.addControl(new DigidemAttrib(), 'bottom-right')
map.addControl(new mapboxgl.ScaleControl(), 'bottom-right')
map.addControl(new mapboxgl.AttributionControl({compact: true}), 'bottom-right')

document.body.appendChild(sidebarDOM(map))
