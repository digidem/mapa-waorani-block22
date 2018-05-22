var views = require('./map_views.json')

var timeoutId
var FADE_DURATION = 1000
var FLY_SPEED = 0.3
var loaded = false

var overlays = [
  'for-conflict-layer-block',
  'for-conflict-layer-petrol',
  'territory-outline',
  'zona-peces',
  'zona-animales',
  'zona-moretal',
  'zona-palmera',
  'rivers-large',
  'rivers-small',
  'rivers-large-highlight',
  'rivers-large-shadow',
  'lagos',
  'rivers-peru-ecuador-colo',
  'country-peru-ecuador-colombia',
  'country-peru-ecuador-colombia-dark',
  'zona-miwago',
  'plant-view',
  'plant-view-curare',
  'rivers-area-peru-ecuador-colo',
  'final-flora',
  'final-comunidades',
  'final-water',
  'final-fauna',
  'flora',
  'fauna',
  'other'
]

Object.keys(views).forEach(function (key) {
  views[key].layerVisibility = overlays.reduce(function (acc, id) {
    acc[id] = views[key].layers.indexOf(id) > -1 ? 'visible' : 'none'
    return acc
  }, {})
})

module.exports = mapTransition

function mapTransition (viewId, map) {
  var view = views[viewId]
  console.log('Transition view:', viewId)
  if (!view) return console.log('undefined view', viewId)

  map.stop()
  map.off('styledata', retry)
  map.off('moveend', showOverlays)

  if (!(loaded || map.isStyleLoaded())) {
    map.once('styledata', retry)
    return
  }

  if (timeoutId) clearTimeout(timeoutId)

  fadeOverlays(false)
  timeoutId = setTimeout(function () {
    hideOverlays()
    moveMap()
  }, FADE_DURATION)

  map.once('moveend', showOverlays)

  function showOverlays () {
    Object.keys(view.layerVisibility).forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      var currentVisibility = map.getLayoutProperty(layerId, 'visibility')
      var targetVisibility = view.layerVisibility[layerId]
      if (currentVisibility === 'none' && targetVisibility === 'visible') {
        setLayerOpacity(map, layerId, false, 0)
      }
      map.setLayoutProperty(layerId, 'visibility', targetVisibility)
    })
    fadeOverlays(true)
  }

  function fadeOverlays (opaque) {
    overlays.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      // if (map.getLayoutProperty(layerId, 'visibility') === 'none') return
      setLayerOpacity(map, layerId, opaque)
    })
  }

  function moveMap () {
    if (view.bounds) {
      map.fitBounds(view.bounds, {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 600
        },
        speed: FLY_SPEED
      })
    } else {
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        speed: FLY_SPEED
      })
    }
  }

  function hideOverlays () {
    overlays.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      map.setLayoutProperty(layerId, 'visibility', 'none')
    })
  }

  // We define this here so we can set it to run on map load, but then
  // turn off the event if needed if another map transition is called
  // before the map loads.
  function retry () {
    loaded = true
    mapTransition(viewId, map)
  }
}

var originalOpacities = {}

function setLayerOpacity (map, layerId, opaque, duration) {
  if (typeof duration === 'undefined') duration = FADE_DURATION
  var layer = map.getLayer(layerId)
  var propName = layer.type === 'symbol' ? 'icon-opacity' : layer.type + '-opacity'
  // Original layer opacity might not be `1`, so save what it was
  var originalOpacity = originalOpacities[layerId] || map.getPaintProperty(layerId, propName)
  var opacity = opaque ? originalOpacity : 0
  // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/6706
  // Need to call `setPaintProperty()` on the layer, not `map`
  layer.setPaintProperty(propName + '-transition', {duration: duration, delay: 0})
  map.setPaintProperty(layerId, propName, opacity)
}
