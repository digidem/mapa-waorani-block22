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
  var defaultCenter = [-75.3506, -0.4848]

  var map = window.map = new mapboxgl.Map({
    container: 'map',
    center: defaultCenter,
    zoom: 10,
    style: config.style,
    hash: false,
    zoomControl: false,
    attributionControl: false,
    scrollZoom: false,
    boxZoom: false,
    maxBounds: [-87, -9, -70, 6],
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

    var lakes = map.getLayer('S - Lakes')
    var lakeHighlight = {
      id: 'lakeHighlight',
      source: lakes.source,
      filter: lakes.filter,
      metadata: lakes.metadata,
      'source-layer': lakes.sourceLayer,
      type: 'line',
      layout: {
        'line-join': 'round'
      },
      paint: {
        'line-color': {
          stops: [
            [12, 'hsl(196, 53%, 40%)'],
            [22, 'hsl(196, 79%, 24%)']
          ]
        },
        'line-opacity': 0,
        'line-width': 3
      }
    }
    map.addLayer(lakeHighlight, 'S - River Areas')
  })

  map.addControl(new DdLogoControl(), 'bottom-right')
  map.addControl(new mapboxgl.ScaleControl(), 'top-right')
  map.addControl(new mapboxgl.AttributionControl({compact: true}), 'bottom-right')
  return map
}
