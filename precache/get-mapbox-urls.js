const traverse = require('traverse')
const request = require('request')

const normalizeSpriteURL = require('./mapbox').normalizeSpriteURL
const normalizeGlyphsURL = require('./mapbox').normalizeGlyphsURL
const normalizeStyleURL = require('./mapbox').normalizeStyleURL
const normalizeSourceURL = require('./mapbox').normalizeSourceURL

module.exports = getUrls

function getUrls (url, accessToken, cb) {
  var styleUrl = normalizeStyleURL(url, accessToken)
  var urls = [styleUrl]

  request(styleUrl, function (err, response, body) {
    if (err) return cb(err)
    var style = JSON.parse(body)
    urls = urls
      .concat(getSpriteUrls(style, accessToken))
      .concat(getGlyphUrls(style, accessToken))
      .concat(getSourceUrls(style, accessToken))
    cb(null, urls)
  })
}

function getSourceUrls (style, accessToken) {
  return Object.keys(style.sources).map(key => {
    return normalizeSourceURL(style.sources[key].url, accessToken)
  })
}

function getSpriteUrls (style, accessToken) {
  if (!style.sprite) return []
  var resources = [
    {format: '', extension: '.png'},
    {format: '', extension: '.json'},
    {format: '@2x', extension: '.png'},
    {format: '@2x', extension: '.json'}
  ]
  return resources.map(function (r) {
    return normalizeSpriteURL(style.sprite, r.format, r.extension, accessToken)
  })
}

function getGlyphUrls (style, accessToken) {
  if (!style.glyphs) return []
  var urlTemplate = normalizeGlyphsURL(style.glyphs, accessToken)
  var fontStacks = getFontStacks(style)
  return fontStacks.map(stack => {
    return glyphUrl(stack, '0-255', urlTemplate)
  })
}

function getFontStacks (style) {
  var fontStacks = {}
  traverse(style).forEach(function (x) {
    if (this.key === 'text-font') {
      if (Array.isArray(x)) {
        fontStacks[x.join(',')] = true
      } else if (typeof x === 'string') {
        fontStacks[x] = true
      } else if (x.stops) {
        x.stops.forEach(stop => {
          var stack = Array.isArray(stop[1]) ? stop[1].join(',') : stop[1]
          fontStacks[stack] = true
        })
      }
    }
  })
  return Object.keys(fontStacks)
}

/**
 * Use CNAME sharding to load a specific glyph range over a randomized
 * but consistent subdomain.
 * @param {string} fontstack comma-joined fonts
 * @param {string} range comma-joined range
 * @param {url} url templated url
 * @param {string} [subdomains=abc] subdomains as a string where each letter is one.
 * @returns {string} a url to load that section of glyphs
 * @private
 */
function glyphUrl (fontstack, range, url, subdomains) {
  subdomains = subdomains || 'abc'

  return url
        .replace('{s}', subdomains[fontstack.length % subdomains.length])
        .replace('{fontstack}', fontstack)
        .replace('{range}', range)
}
