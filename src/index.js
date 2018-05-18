const xhr = require('xhr')
const css = require('sheetify')
const querystring = require('querystring')
const mapboxgl = require('mapbox-gl')
const lozad = require('lozad')()
const elements = require('alianza-elements')
const DigidemAttrib = require('@digidem/attribution-control')

const communityDOM = require('./community_popup')
const sidebarDOM = require('./sidebar')
const urls = require('../static/urls.json')

if (process.env.NODE_ENV === 'production') {
  require('./service-worker')
  var prefetched = localStorage.getItem('prefetched-waorani-assets')
  if (!prefeteched) {
    localStorage.setItem('prefetched-waorani-assets', true)
    urls.forEach(function (url) {
      xhr(url, function (err, resp, body) {
        if (err) console.error(err)
      })
    })
  }
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
  maxBounds: [-87, -9, -70, 3],
  style: 'mapbox://styles/aliya/cjgowcgqq00a62spkeo922ik6?fresh=true',
  hash: false,
  zoomControl: false,
  attributionControl: false,
  scrollZoom: false,
  boxZoom: false,
  doubleClickZoom: false
}).on('load', onLoad)

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
  onLoad()
})

map.addControl(new mapboxgl.ScaleControl(), 'top-right')
map.addControl(new mapboxgl.AttributionControl({compact: true}), 'top-right')
map.addControl(new DigidemAttrib(), 'bottom-right')

map.on('style.load', function () {
  var sidebar = sidebarDOM(map, map.getStyle().layers)
  document.body.appendChild(sidebar)
  lozad.observe()
})

var communityPopup = elements.popup(map)

function onLoad () {
  // When a click event occurs near a place, open a popup at the location of
  // the feature, with description HTML from its properties.
  map.on('click', function (e) {
    var _features = map.queryRenderedFeatures(e.point, {filter: ['!=', '$id', 1]})
    var feature = _features && _features[0]
    if (feature) {
      var coords = feature.geometry.type === 'Point' ? feature.geometry.coordinates : map.unproject(e.point)
      var opts = {feature, lang}
      var preset = feature.properties.preset
      if (preset) {
        var airtable = dataIndex[preset.toLowerCase()]
        opts.data = airtable ? airtable.properties : {}
      }
      communityPopup.update(communityDOM(opts))
      communityPopup.setLngLat(coords)
      return
    }
    communityPopup.remove()
  })

  // Use the same approach as above to indicate that the symbols are clickable
  // by changing the cursor style to 'pointer'.
  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point)
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''
  })
}
