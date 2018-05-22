var views = require('./map_views.json')

var timeoutId
var FADE_DURATION = 1000

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
  if (!view) return console.log('undefined view', viewId)
  if (!map.loaded()) return console.log('not loaded', viewId)

  map.stop()
  map.off('moveend', showOverlays)
  if (timeoutId) clearTimeout(timeoutId)

  fadeOverlays(0)
  timeoutId = setTimeout(function () {
    hideOverlays()
    moveMap()
  }, FADE_DURATION)

  map.on('moveend', showOverlays)

  function showOverlays () {
    Object.keys(view.layerVisibility).forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      var currentVisibility = map.getLayoutProperty(layerId, 'visibility')
      var targetVisibility = view.layerVisibility[layerId]
      if (currentVisibility === 'none' && targetVisibility === 'visible') {
        console.log('opacity 0', layerId)
        setLayerOpacity(map, layerId, 0, 0)
      }
      map.setLayoutProperty(layerId, 'visibility', targetVisibility)
    })
    fadeOverlays(1)
  }

  function fadeOverlays (opacity) {
    overlays.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      // if (map.getLayoutProperty(layerId, 'visibility') === 'none') return
      setLayerOpacity(map, layerId, opacity)
    })
  }

  function moveMap () {
    map.flyTo({
      center: view.center,
      zoom: view.zoom,
      speed: 0.3
    })
  }

  function hideOverlays () {
    overlays.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      map.setLayoutProperty(layerId, 'visibility', 'none')
    })
  }
}

function setLayerOpacity (map, layerId, opacity, duration) {
  if (typeof duration === 'undefined') duration = FADE_DURATION
  var layer = map.getLayer(layerId)
  var propName = layer.type === 'symbol' ? 'icon-opacity' : layer.type + '-opacity'
  map.setPaintProperty(layerId, propName + '-transition', {duration: duration, delay: 0})
  map.setPaintProperty(layerId, propName, opacity)
}
