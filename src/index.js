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
if (!mobile) {
  map = createMap()
  prefetch(map)
}
document.body.appendChild(sidebarDOM(lang, map))
