var views = require('./map_views.json')

var overlays = [
  'for-conflict-layer-block',
  'for-conflict-layer-petrol',
  'background',
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
  if (!map.loaded()) return

  map.stop()
  map.off('moveend', showOverlays)

  hideOverlays()

  map.flyTo({
    center: view.center,
    zoom: view.zoom,
    speed: 0.3
  })
  map.on('moveend', showOverlays)

  function showOverlays () {
    Object.keys(view.layerVisibility).forEach(function (layerId) {
      var currentVisibility = map.getLayoutProperty(layerId, 'visibility')
      var targetVisibility = view.layerVisibility[layerId]
      if (targetVisibility === currentVisibility) return
      map.setLayoutProperty(layerId, 'visibility', targetVisibility)
    })
  }

  function hideOverlays () {
    overlays.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.log('no layer', layerId)
      var visibility = map.getLayoutProperty(layerId, 'visibility')
      if (visibility === 'none') return
      map.setLayoutProperty(layerId, 'visibility', 'none')
    })
  }
}
