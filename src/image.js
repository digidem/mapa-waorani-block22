/* global Image */

var Nanocomponent = require('nanocomponent')
var html = require('nanohtml')
var css = require('sheetify')

var fixedAspect = require('./fixed-aspect')

var shadeClass = css`
  :host {
    transition: background-color 200ms ease-out;
    transform: translateZ(0);
    will-change: background-color;
    z-index: 2;
    background-color: rgba(0,0,0,0);
    cursor: zoom-out;
    position: fixed !important;
  }
  :host.zoomed {
    background-color: rgba(0,0,0,0.8);
  }
`

var imageClass = css`
  :host {
    cursor: zoom-in;
    will-change: width,height,top,bottom;
  }
`

const RESIZE_URL = 'https://resizer.digital-democracy.org/'

module.exports = ZoomableImage

function ZoomableImage () {
  if (!(this instanceof ZoomableImage)) return new ZoomableImage()
  this.zoomin = this.zoomin.bind(this)
  this.zoomout = this.zoomout.bind(this)
  this.removeShade = this.removeShade.bind(this)
  this.returnInline = this.returnInline.bind(this)
  Nanocomponent.call(this)
}

ZoomableImage.prototype = Object.create(Nanocomponent.prototype)

ZoomableImage.prototype.zoomin = function () {
  var self = this
  var dim = getViewport()
  if (dim[0] <= this.element.width) return
  dim = dim.map(function (n) {
    return n * window.devicePixelRatio
  })
  disableScroll(this.element)
  var zoomedImgUrl = RESIZE_URL + dim[0] + '/' + dim[1] + '/70/' + this.url
  var zoomedImg = new Image()
  zoomedImg.crossOrigin = 'anonymous'
  zoomedImg.onload = function () {
    self.img.src = zoomedImgUrl
  }
  zoomedImg.src = zoomedImgUrl
  var rect = this.element.getBoundingClientRect()
  Object.assign(this.img.style, {
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    position: 'fixed',
    transform: 'translateZ(0)',
    zIndex: 9999
  })
  this.element.insertBefore(this.shade, this.img)
  setTimeout(function () {
    self.img.style.cursor = 'zoom-out'
    self.shade.classList.add('zoomed')
    self.img.onclick = self.zoomout
    Object.assign(self.img.style, {
      transition: 'all 200ms ease-out',
      objectFit: 'contain',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    })
  }, 20)
}

ZoomableImage.prototype.zoomout = function () {
  this.shade.classList.remove('zoomed')
  this.shade.addEventListener('transitionend', this.removeShade)
  this.img.addEventListener('transitionend', this.returnInline)
  var rect = this.element.getBoundingClientRect()
  Object.assign(this.img.style, {
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px'
  })
}

ZoomableImage.prototype.removeShade = function () {
  this.shade.removeEventListener('transitionend', this.removeShade)
  if (!this.shade.parentNode) return
  this.shade.parentNode.removeChild(this.shade)
}

ZoomableImage.prototype.returnInline = function () {
  this.img.removeEventListener('transitionend', this.returnInline)
  enableScroll(this.img)
  this.img.onclick = this.zoomin
  Object.assign(this.img.style, {
    objectFit: 'cover',
    transition: 'none',
    transform: null,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'zoom-in',
    position: null,
    zIndex: 0
  })
}

ZoomableImage.prototype.createElement = function (url) {
  this.url = url
  var src = RESIZE_URL + '400/400/20/' + url
  this.img = html`<img class=${imageClass} crossorigin="anonymous" onclick=${this.zoomin} src=${src} />`
  this.shade = html`<div class=${shadeClass} />`
  this.shade.onclick = this.zoomout
  return fixedAspect('3x2', this.img)
}

ZoomableImage.prototype.update = function (url) {
  return this.url !== url
}

ZoomableImage.prototype.load = function (el) {
  var responsiveImg = new Image()
  var img = this.img
  // Get image width rounded to nearest 100
  var width = Math.ceil(this.img.width / 100) * 100 * window.devicePixelRatio
  var imageUrl = RESIZE_URL + width + '/' + this.url
  responsiveImg.crossOrigin = 'anonymous'
  responsiveImg.onload = function () {
    img.src = imageUrl
  }
  responsiveImg.src = imageUrl
}

function getViewport () {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  return [w, h]
}

function disableScroll (el) {
  el.addEventListener('mousewheel', stopPropagation)
  el.addEventListener('touchmove', stopPropagation)
}

function enableScroll (el) {
  el.removeEventListener('mousewheel', stopPropagation)
  el.removeEventListener('touchmove', stopPropagation)
}

function stopPropagation (e) {
  e.stopPropagation()
  e.preventDefault()
  return false
}
