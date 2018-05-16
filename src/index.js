const xhr = require('xhr')
const css = require('sheetify')
const elements = require('alianza-elements')
const mapboxgl = require('mapbox-gl')
const querystring = require('querystring')
const lozad = require('lozad')()

const sidebarDOM = require('./sidebar')
const communityDOM = require('./community_popup')

if (process.env.NODE_ENV === 'production') {
  require('./service-worker')
}

var data = {}
var dataIndex = {}

css('mapbox-gl/dist/mapbox-gl.css')
css('alianza-elements/style.css')

var qs = querystring.parse(window.location.search.replace('?', ''))
var lang = qs.lang || 'es'
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'
var nemonpareCenter = [ -77.2593, -1.2322 ]
var defaultCenter = [ -79.656232, -0.489971 ]

var map = window.map = new mapboxgl.Map({
  container: 'map',
  center: defaultCenter,
  zoom: 8,
  maxBounds: [-87, -9, -70, 3],
  style: 'mapbox://styles/aliya/cjgowcgqq00a62spkeo922ik6?fresh=true',
  hash: true,
  attributionControl: false
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

map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 150,
  unit: 'metric'
}), 'bottom-right')

map.addControl(new mapboxgl.NavigationControl(), 'top-right')
map.addControl(new mapboxgl.FullscreenControl(), 'top-right')
map.addControl(new mapboxgl.AttributionControl({compact: true}))

var communityPopup = elements.popup(map)
var sidebar = sidebarDOM(map)
document.body.appendChild(sidebar)
lozad.observe()

function onLoad () {
  // When a click event occurs near a place, open a popup at the location of
  // the feature, with description HTML from its properties.
  map.on('click', function (e) {
    var _areas = map.queryRenderedFeatures(e.point, {layers: ['Territory fill']})
    var _features = map.queryRenderedFeatures(e.point, {filter: ['!=', '$id', 1]})
    var area = _areas && _areas[0]
    var feature = _features && _features[0]
    if (area && map.getZoom() <= 9) {
      map.easeTo({center: nemonpareCenter, zoom: 11, duration: 2500})
      communityPopup.remove()
      return
    }
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
