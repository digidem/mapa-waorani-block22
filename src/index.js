const createMap = require('./map.js')
const querystring = require('querystring')
const sidebarDOM = require('./sidebar')
// const territory = require('../static/territory-wao-simplified.json')
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
if (!mobile) map = createMap()
document.body.appendChild(sidebarDOM(lang, map))
