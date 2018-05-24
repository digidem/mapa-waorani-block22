var morph = require('nanomorph')

const createMap = require('./map.js')
const querystring = require('querystring')
const sidebarDOM = require('./sidebar')
const prefetch = require('./prefetch')

var mobile = window.innerWidth < 601

var qs = querystring.parse(window.location.search.replace('?', ''))
var lang = qs.lang || 'en'

if (typeof qs.translate !== 'undefined') {
  lang = 'xx'
  window._jipt = [['project', 'mapa-waorani-block22']]
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = '//cdn.crowdin.com/jipt/jipt.js'
  document.head.appendChild(script)
}

var map
var sidebarEl = document.getElementById('sidebar')

if (!mobile) {
  require('./service-worker')
  loadMapbox(function () {
    map = createMap()
    if ('serviceWorker' in navigator) {
      prefetch(map)
    }
    morph(sidebarEl, sidebarDOM(lang, map))
  })
} else {
  morph(sidebarEl, sidebarDOM(lang, map))
}

function loadMapbox (cb) {
  var pending = 2

  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.45.0/mapbox-gl.js'
  script.onload = done

  var cssLink = document.createElement('link')
  cssLink.rel = 'stylesheet'
  cssLink.href = 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.45.0/mapbox-gl.css'
  cssLink.onload = done

  function done () {
    console.log(pending)
    if (--pending) return
    cb()
  }

  var docHead = document.getElementsByTagName('head')[0]
  docHead.appendChild(script)
  docHead.appendChild(cssLink)
}
