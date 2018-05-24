const xhr = require('xhr')
const css = require('sheetify')
const mapboxgl = require('mapbox-gl')
const urls = require('../static/urls.json')
const mapViews = require('./map_views.json')

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
  css('mapbox-gl/dist/mapbox-gl.css')

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
    logoPosition: 'bottom-right'
  })

  map.fitBounds(mapViews.start.bounds, {
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 600
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
  })

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
