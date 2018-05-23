const querystring = require('querystring')

const createMap = require('./map.js')
const sidebarDOM = require('./sidebar')
// const territory = require('../static/territory-wao-simplified.json')
var mobile = window.innerWidth < 601

var qs = querystring.parse(window.location.search.replace('?', ''))
var lang = qs.lang || 'en'

var map
if (!mobile) map = createMap()

document.body.appendChild(sidebarDOM(lang, map))
