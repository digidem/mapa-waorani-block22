var Nanocomponent = require('nanocomponent')
var html = require('nanohtml')
var css = require('sheetify')
const onIntersectOrig = require('on-intersect')
const Player = require('@vimeo/player')

var fixedAspect = require('./fixed-aspect')

function onIntersect () {
  if (typeof window === 'undefined') return
  onIntersectOrig.apply(null, arguments)
}

var videoDivClass = css`
  :host {
    background-position: center;
    background-size: contain;
    will-change: width,height,top,bottom;
    cursor: zoom-in;
    user-select: none;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  :host iframe {
    pointer-events: none;
  }
`

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

const RESIZE_URL = 'https://resizer.digital-democracy.org/'

module.exports = ZoomableVideo

function ZoomableVideo () {
  if (!(this instanceof ZoomableVideo)) return new ZoomableVideo()
  this.onenter = this.onenter.bind(this)
  this.onexit = this.onexit.bind(this)
  this.zoomin = this.zoomin.bind(this)
  this.zoomout = this.zoomout.bind(this)
  this.removeShade = this.removeShade.bind(this)
  this.returnInline = this.returnInline.bind(this)
  Nanocomponent.call(this)
}

ZoomableVideo.prototype = Object.create(Nanocomponent.prototype)

ZoomableVideo.prototype.zoomin = function () {
  var dim = getViewport()
  if (dim[0] <= this.element.clientWidth) {
    if (!this.background && this.player) {
      this.player.play()
    }
    return
  }
  this.shade.removeEventListener('transitionend', this.removeShade)
  this.wrapperDiv.removeEventListener('transitionend', this.returnInline)
  disableScroll(this.wrapperDiv)
  var self = this
  var wrapperDiv = this.wrapperDiv
  var rect = this.element.getBoundingClientRect()
  this.element.insertBefore(this.shade, wrapperDiv)
  wrapperDiv.onclick = self.zoomout
  wrapperDiv.style.cursor = 'zoom-out'
  self.shade.onclick = self.zoomout
  if (!this.background && this.player) this.player.play()
  if (this.iframe) this.iframe.style.transform = 'translateZ(0)'
  Object.assign(wrapperDiv.style, {
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    position: 'fixed',
    zIndex: 9999
  })
  setTimeout(function () {
    self.shade.classList.add('zoomed')
    Object.assign(wrapperDiv.style, {
      transition: 'all 200ms ease-out',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    })
  }, 20)
}

ZoomableVideo.prototype.zoomout = function () {
  this.shade.classList.remove('zoomed')
  this.shade.addEventListener('transitionend', this.removeShade)
  this.wrapperDiv.addEventListener('transitionend', this.returnInline)
  var rect = this.element.getBoundingClientRect()
  if (!this.background && this.player) this.player.pause()
  Object.assign(this.wrapperDiv.style, {
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px'
  })
}

ZoomableVideo.prototype.removeShade = function () {
  this.shade.removeEventListener('transitionend', this.removeShade)
  if (!this.shade.parentNode) return
  this.shade.parentNode.removeChild(this.shade)
}

ZoomableVideo.prototype.returnInline = function () {
  this.wrapperDiv.removeEventListener('transitionend', this.returnInline)
  enableScroll(this.wrapperDiv)
  this.wrapperDiv.onclick = this.zoomin
  if (this.iframe) this.iframe.style.transform = null
  Object.assign(this.wrapperDiv.style, {
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

ZoomableVideo.prototype.onenter = function () {
  this.player = new Player(this.wrapperDiv, {
    url: this.url,
    background: this.background,
    playsinline: this.background
  })
  this.player.ready().then(() => {
    this.wrapperDiv.style.backgroundSize = 0
    this.iframe = this.wrapperDiv.childNodes[0]
  })
  if (this.background) this.player.setCurrentTime(2)
}

ZoomableVideo.prototype.onexit = function exit () {
  this.wrapperDiv.style.backgroundSize = 'cover'
  this.player.destroy()
  this.iframe = null
}

ZoomableVideo.prototype.createElement = function (props) {
  this.url = props.url
  this.placeholder = props.placeholder
  this.background = props.background
  var placeholderUrl = RESIZE_URL + '400/400/20/' + this.placeholder
  this.wrapperDiv = html`<div
    class=${videoDivClass}
    style="background-image: url(${placeholderUrl});"
    onclick=${this.zoomin} />`
  this.aspectDiv = fixedAspect('16x9', this.wrapperDiv)
  this.shade = html`<div
    onclick=${this.zoomout}
    class=${shadeClass} />`
  return this.aspectDiv
}

ZoomableVideo.prototype.beforerender = function (el) {
  onIntersect(el, this.onenter, this.onexit)
}

ZoomableVideo.prototype.update = function () {
  return false
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
