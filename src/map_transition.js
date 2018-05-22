var mm = require('micromatch')
var EventEmitter = require('events')
var views = require('./map_views.json')

var FADEIN_DURATION = 1000
var FADEOUT_DURATION = 250
var FLY_SPEED = 0.3

// These layers are complex to draw (calculating collisions) so we always
// hide them when transitioning between map views to avoid animation jitter
var HIDDEN_TRANSITION_LAYERS = [
  'rivers-large-highlight',
  'rivers-large-shadow',
  'plant-view*',
  'final-*',
  'wildlife-view-*',
  'flora',
  'fauna',
  'other'
]

var timeoutId
var hiddenLayersExpanded
var loaded = false
var events = new EventEmitter()

module.exports = mapTransition

function mapTransition (viewId, map) {
  var view = views[viewId]
  console.log('Transition view:', viewId)
  if (!view) return console.log('undefined view', viewId)

  // It's a little tricky to cancel other transition events, because each
  // call to mapTransition() creates a new instance of the functions that we
  // call, so we use a global event emitter to stop all other transitions
  events.emit('stop')
  events.once('stop', function () {
    map.stop()
    map.off('sourcedata', onsourcedata)
    map.off('styledata', retry)
    map.off('moveend', showOverlays)
  })
  if (timeoutId) clearTimeout(timeoutId)

  if (!(loaded || map.isStyleLoaded())) {
    map.once('styledata', retry)
    return
  }

  if (!hiddenLayersExpanded) expandLayerGlobs(map)

  fadeoutLayers()
  console.log(viewId, 'fadeout layers')
  timeoutId = setTimeout(function () {
    console.log(viewId, 'move map')
    hideOverlays()
    moveMap()
  }, FADEOUT_DURATION)

  map.once('moveend', showOverlays)

  function showOverlays () {
    Object.keys(view.layerOpacity).forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      var currentVisibility = map.getLayoutProperty(layerId, 'visibility')
      var targetOpacity = view.layerOpacity[layerId]
      if (currentVisibility === 'none' && targetOpacity > 0) {
        setLayerOpacity(map, layerId, 0, 0)
        map.setLayoutProperty(layerId, 'visibility', 'visible')
      }
    })
    // Don't fadein until tiles are loaded, avoid sudden transition
    if (map.areTilesLoaded()) {
      console.log(viewId, 'tiles were loaded, fading in')
      return fadeinLayers()
    }
    console.log(viewId, 'tiles were not loaded, setting tiledata listener')
    map.on('sourcedata', onsourcedata)
  }

  function onsourcedata () {
    console.log(viewId, 'tiledata')
    if (!map.areTilesLoaded()) return
    console.log(viewId, 'fading in tiles after load')
    map.off('sourcedata', onsourcedata)
    fadeinLayers()
  }

  function fadeoutLayers () {
    // Fadeout layers that we need to hide during transitions for perf
    hiddenLayersExpanded.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.warn('no layer', layerId)
      setLayerOpacity(map, layerId, 0, FADEOUT_DURATION)
    })
    // Fadeout layers that do not appear in the target view
    Object.keys(view.layerOpacity).forEach(function (layerId) {
      if (view.layerOpacity[layerId] > 0) return
      // console.log('fadeout', layerId)
      setLayerOpacity(map, layerId, 0, FADEOUT_DURATION)
    })
  }

  function fadeinLayers () {
    // Fadein layers in target view
    Object.keys(view.layerOpacity).forEach(function (layerId) {
      console.log('fadein', layerId)
      setLayerOpacity(map, layerId, view.layerOpacity[layerId], FADEIN_DURATION)
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
    hiddenLayersExpanded.forEach(function (layerId) {
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

function setLayerOpacity (map, layerId, opacity, duration) {
  if (typeof duration === 'undefined') duration = FADEIN_DURATION
  var layer = map.getLayer(layerId)
  var propNames = getOpacityPropNames(layer)
  // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/6706
  // Need to call `setPaintProperty()` on the layer, not `map`
  propNames.forEach(function (propName) {
    layer.setPaintProperty(propName + '-transition', {duration: duration, delay: 0})
    map.setPaintProperty(layerId, propName, opacity)
  })
}

function expandLayerGlobs (map) {
  var mapLayers = map.getStyle().layers.map(function (l) {
    return l.id
  })
  hiddenLayersExpanded = mm(mapLayers, HIDDEN_TRANSITION_LAYERS)
  Object.keys(views).forEach(function (key) {
    var expandedLayerOpacity = {}
    var layerMatchPatterns = Object.keys(views[key].layerOpacity)
    layerMatchPatterns.forEach(function (pattern) {
      var matchedLayers = mm(mapLayers, pattern)
      matchedLayers.forEach(function (layerId) {
        expandedLayerOpacity[layerId] = views[key].layerOpacity[pattern]
      })
    })
    views[key].layerOpacity = expandedLayerOpacity
  })
}

function getOpacityPropNames (layer) {
  if (layer.type !== 'symbol') return [layer.type + '-opacity']
  var propNames = []
  if (layer.getLayoutProperty('icon-image')) propNames.push('icon-opacity')
  if (layer.getLayoutProperty('text-field')) propNames.push('text-opacity')
  return propNames
}
