/* global mapboxgl */

const css = require('sheetify')
const mapViews = require('./map_views.json')
const config = require('../mapbox-config')

var logoClassname = css`
  .mapboxgl-ctrl-bottom-right {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
  }
  :host {
    margin-bottom: calc(5vh + 4vw) !important;
  }
  :host {
    padding: 2px 5px;
  }
  :host, :host a {
    color: white;
    text-decoration: none;
    text-shadow: 0px 0px 2px rgb(0, 0, 0);
    font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
  }
  :host a {
    display: block;
    position: relative;
    background-repeat: no-repeat;
    background-size: 21px;
    background-position: right;
  }
  :host:hover {
  }
  :host:hover a {
  }
`

function DdLogoControl () {
  this._container = null
}

DdLogoControl.prototype.onAdd = function (map) {
  var el = document.createElement('div')
  el.className = 'mapboxgl-ctrl ' + logoClassname
  el.innerHTML = '<a href="https://digital-democracy.org" target="_parent">Digital Democracy</a>'
  this._container = el
  return el
}

DdLogoControl.prototype.onRemove = function () {
  this._container.parentNode.removeElement(this._container)
}

module.exports = function () {
  // var qs = querystring.parse(window.location.search.replace('?', ''))
  mapboxgl.accessToken = config.accessToken
  var defaultCenter = [ -79.656232, -0.489971 ]

  var map = window.map = new mapboxgl.Map({
    container: 'map',
    center: defaultCenter,
    zoom: 6,
    style: config.style,
    hash: false,
    zoomControl: false,
    attributionControl: false,
    scrollZoom: false,
    boxZoom: false,
    doubleClickZoom: false,
    interactive: false,
    logoPosition: 'bottom-right'
  })

  var sidebar = document.getElementById('sidebar')
  var sidebarWidth = sidebar ? sidebar.clientWidth : 500

  map.fitBounds(mapViews.start.bounds, {
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: sidebarWidth
    },
    duration: 0
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
    id: 'bing-satellite',
    type: 'raster',
    source: 'bing',
    layout: {
    },
    paint: {
    }
  }

  map.once('styledata', function () {
    map.addSource('bing', bingSource)
    map.addLayer(bing, 'territory-outline')
    map.setLayoutProperty('background', 'visibility', 'none')
    map.setPaintProperty('background', 'background-opacity', 0)
  })

  map.once('load', function () {
    document.body.style['background-image'] = 'none'
  })

  map.on('moveend', () => console.log('moveend'))
  // Attempt at bootstrapping Wao territory to improve initial load speed
  // map.once('styledata', function () {
  //   map.addSource('territory-bootstrapped', {
  //     type: 'geojson',
  //     data: territory
  //   })
  //   var layers = map.getStyle().layers
  //   var territoryFill = layers.find(function (l) {
  //     return l.id === 'territory-fill'
  //   })
  //   var territoryOutline = layers.find(function (l) {
  //     return l.id === 'territory-outline'
  //   })
  //   territoryFill.id = 'territory-fill-bootstrapped'
  //   territoryOutline.id = 'territory-outline-bootstrapped'
  //   territoryFill.source = territoryOutline.source = 'territory-bootstrapped'
  //   territoryFill['source-layer'] = territoryOutline['source-layer'] = ''
  //   map.addLayer(territoryFill, 'territory-fill')
  //   map.addLayer(territoryOutline, 'territory-fill')
  // })

  map.addControl(new DdLogoControl(), 'bottom-right')
  map.addControl(new mapboxgl.ScaleControl(), 'top-right')
  map.addControl(new mapboxgl.AttributionControl({compact: true}), 'bottom-right')
  return map
}
