const css = require('sheetify')
const elements = require('alianza-elements')
const mapboxgl = require('mapbox-gl')
const ToggleControl = require('mapbox-gl-toggle-control')
const querystring = require('querystring')

var Legend = require('./legend')
var communityDOM = require('./community_popup')

css('mapbox-gl/dist/mapbox-gl.css')
css('alianza-elements/style.css')

var qs = querystring.parse(window.location.search.replace('?',''))
var lang = qs.lang || 'es'
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g';
var defaultCenter = [-77.2593, -1.2322]

var map = window.map = new mapboxgl.Map({
  container: 'map',
  center: defaultCenter,
  zoom: 8,
  maxBounds: [-87, -9, -70, 6],
  style: 'mapbox://styles/aliya/cj5i9q1lb4wnx2rnxmldrtjvt?fresh=true',
  hash: true
})

map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 150,
  unit: 'metric'
}))

var nav = new mapboxgl.NavigationControl()
map.addControl(nav, 'top-left')
map.addControl(new mapboxgl.FullscreenControl(), 'top-left')

var legend = Legend({lang: lang})
var legendCtrl = new ToggleControl(legend.el)
legendCtrl.show()
map.addControl(legendCtrl, 'top-left')
legendCtrl._toggleButton.setAttribute('aria-label', 'Toggle Legend')

var communityPopup = elements.popup(map)

var langSelector = elements.language(updateLang, lang)
document.body.appendChild(langSelector)

var backButton = elements.backButton(map, {stop: 9, lang: lang}, function () {
  map.easeTo({center: defaultCenter, zoom: 8, duration: 2500})
})

// When a click event occurs near a place, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {
  var _areas = map.queryRenderedFeatures(e.point, {layers: ["Territory fill"]})
  var _features = map.queryRenderedFeatures(e.point, {filter: ['!=', '$id', 1]})
  var area = _areas && _areas[0]
  var feature = _features && _features[0]
  if (area && map.getZoom() <= 9) {
    map.easeTo({center: defaultCenter, zoom: 11, duration: 2500})
    communityPopup.remove()
    return
  }
  if (feature) {
    var coords = feature.geometry.type === 'Point' ? feature.geometry.coordinates : map.unproject(e.point)
    communityPopup.update(communityDOM(feature, {lang: lang}))
    communityPopup.setLngLat(coords)
    return
  }
  communityPopup.remove()
})

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point);
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

function updateLang (_) {
  lang = _
  backButton.updateLang(lang)
  legend.updateLang(lang)
}
