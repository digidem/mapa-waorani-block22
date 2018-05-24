/* global Image */

const css = require('sheetify')
const Player = require('@vimeo/player')
const html = require('nanohtml')
const onIntersectOrig = require('on-intersect')
const onload = require('on-load')

function onIntersect () {
  if (typeof window === 'undefined') return
  onIntersectOrig.apply(null, arguments)
}

var map
var translations = {
  es: require('../messages/es.json'),
  en: require('../messages/en.json'),
  xx: require('../messages/xx.json')
}

var mapTransition = require('./map_transition')

const RESIZE_URL = 'https://resizer.digital-democracy.org/'
const IMAGE_URL = 'https://images.digital-democracy.org/waorani-images/'

var aspectStyle = css`
  .center {
    text-align: center;
  }
  :host {
    width: 100%;
    position: relative;
  }
  :host.aspect-16x9 {
    padding-bottom: 56.25%;
  }
  :host.aspect-3x2 {
    padding-bottom: 66.67%;
  }
  :host > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
  @media only screen and (max-width: 600px) {
    :host {
      width: 100vw;
      left: -10px;
    }
    :host.aspect-16x9 {
      padding-bottom: calc(56.25% + 11.25px);
    }
    :host.aspect-3x2 {
      padding-bottom: calc(66.67% + 11.25px);
    }
  }
`

var videoDivStyle = css`
  :host {
    background-position: center;
    background-size: cover;
    background-color: black;
  }
`

function aspectDiv (aspect, el) {
  return html`<div class="${aspectStyle} aspect-${aspect}">
    <div>
      ${el}
    </div>
  </div>`
}

function mapView (id, onenter, el) {
  // Don't consider title in map view until more than 40% from bottom
  // of the viewport
  var opts = {
    rootMargin: `0px 0px -40% 0px`
  }
  onIntersect(el, opts, function () {
    onenter(id)
  })
  return el
}

function video (url, opts) {
  // TODO: create placeholder images for videos
  if (!opts) opts = {}
  var options = Object.assign({
    url: url,
    background: true,
    autoplay: true,
    muted: false,
    loop: true,
    title: false,
    portrait: false,
    byline: false
  }, opts)
  var previewUrl = RESIZE_URL + '400/400/20/' + IMAGE_URL + opts.placeholderImg
  var el = html`
  <div class=${videoDivStyle} style="background-image: url(${previewUrl});">
  </div>`
  var player

  // var muted = true
  onIntersect(el, onenter, onexit)

  // function toggleMute () {
  //   if (!player) return
  //   player.ready().then(function () {
  //     return player.setVolume(muted ? 1 : 0)
  //   }).then(function () {
  //     muted = !muted
  //   })
  // }

  function onenter () {
    var img = new Image()
    // Get image width rounded to nearest 100
    var width = Math.ceil(el.offsetWidth / 100) * 100 * window.devicePixelRatio
    var imageUrl = RESIZE_URL + width + '/' + IMAGE_URL + opts.placeholderImg
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    img.onload = function () {
      el.style['background-image'] = 'url(' + imageUrl + ')'
    }
    player = new Player(el, options)
    player.element.style.width = '100%'
    player.element.style.height = '100%'
    if (options.background) player.setCurrentTime(2)
  }

  function onexit () {
    player.destroy()
  }
  return aspectDiv('16x9', el)
}

function image (path) {
  var hasBeenSeen = false
  var previewUrl = RESIZE_URL + '400/400/20/' + IMAGE_URL + path + '.jpg'
  var el = html`<img crossorigin="anonymous" src=${previewUrl} />`

  onIntersect(el, function () {
    if (hasBeenSeen) return
    var img = new Image()
    // Get image width rounded to nearest 100
    var width = Math.ceil(el.width / 100) * 100 * window.devicePixelRatio
    var imageUrl = RESIZE_URL + width + '/' + IMAGE_URL + path + '.jpg'
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    img.onload = function () {
      el.src = imageUrl
    }
    hasBeenSeen = true
  })

  return aspectDiv('3x2', el)
}

var style = css`
  :host {
    width: 100%;
    position: fixed;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    max-height: 100%;
    transform: translateZ(0);
    #sidebar {
      transform: translateZ(0);
      z-index: 999;
      color: white;
      section {
        min-height: 100vh;
        padding-bottom: 20vh;
        padding-top: 4em;
        box-sizing: border-box;
      }
      section:last-child {
        padding-bottom: 10vh;
      }
      section:first-child {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 0;
      }
      img {
        max-width: 100%;
      }
      video {
        max-width: 100%;
      }
      iframe {
        width: 100%;
        height: 100%;
      }
      .caption {
        text-align: left;
        margin-top: 10px;
        color: #ccc;
      }
      &::-webkit-scrollbar {
        display: none;
      }
      h1 {
        line-height: 1.3;
        font-size: 3rem;
      }
      h2 {
        font-size: 2.4rem;
      }
      h3 {
        font-size: 2rem;
      }
      p {
        line-height: 1.75;
        margin-bottom: 2em;
        margin-top: 2em;
        font-size: 1.1rem;
      }
      p.big {
        font-weight: bold;
        font-size: 1.3em;
      }
      p.small {
        font-size: .8em;
        padding-top: 20px;
        color: #ccc;
      }
    }
  }
  .button-action {
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: #fa4e0e;
    border-radius: 10%;
    text-shadow: none;
    color: white;
    transition: all 0.75s ease-out 0s;
    cursor: pointer;
    outline: 0;
    border: 0;
    padding: 20px;
    margin: auto;
    font-family: FuturaPassata, Helvetica, sans-serif;
    text-decoration: none;
    font-size: 1rem;
    &:hover {
      background: #fff;
      color: #fa4e0e;
      text-decoration: none;
      transition: all 0.75s ease 0s;
      text-shadow: none;
    }
  }
  @media only screen and (max-width: 600px) {
    :host {
      background: black;
      padding: 10px;
      #sidebar {
        width: 95%;
      }
    }
  }
  @media only screen and (min-width: 601px) {
    :host {
      background: linear-gradient(to right, rgba(22,22,22, .6), rgba(22,22,22, .4) 40%, rgba(22,22,22, .2) 60%, transparent 70%);
      #sidebar {
        margin-right: -16px;
        margin-left: 20px;
        width: 45%;
        max-width: 600px;
      }
    }
  }
  @media only screen and (min-width: 1333px) {
    :host {
      background: linear-gradient(to right, rgba(22,22,22, .6), rgba(22,22,22, .4) 533px, rgba(22,22,22, .2) 666px, transparent 933px);
    }
  }
`

module.exports = function (lang, _map) {
  map = _map
  function message (key) {
    var msg = translations[lang][key]
    return msg ? msg.message : translations['en'][key].message
  }
  function onview (id) {
    if (map) mapTransition(id, map)
  }

  return html`<div id="sidebar-wrapper" class=${style}>
  <div id="sidebar">
      <section>
        ${mapView('start', onview, html`<h1>${message('title')}</h1>`)}
        ${video('https://vimeo.com/270209852/d857a916b5', {placeholderImg: '1territory.jpg'})}
        <p>${message('start')}</p>
      </section>
      <section>
        ${image('1e')}
        <p>${message('start-2')}</p>
      </section>
      <section>
        ${mapView('oil-rush', onview, html`<h2>${message('oil-rush-title')}</h2>`)}
        ${image('2a')}
        <p>${message('oil-rush')}</p>
        ${video('https://vimeo.com/270208622/ee7d7a12cc', {placeholderImg: '2oil.jpg'})}
      </section>
      <section>
        ${mapView('maps-and-resistance', onview, html`<h2>${message('maps-and-resistance-title')}</h2>`)}
        ${image('3a')}
        <p>${message('maps-and-resistance')}</p>
        ${image('3b')}
        <p>${message('maps-and-resistance-2')}</p>
        ${image('3c')}
      </section>
      <section>
        ${mapView('wildlife', onview, html`<h2>${message('at-stake')}</h2>`)}
        <h3>${message('wildlife-title')}</h3>
        ${video('https://vimeo.com/270211119/a857892d50', {placeholderImg: '3wildlife.jpg'})}
        <p>${message('wildlife')}</p>
        ${image('4WildlifeB')}
      </section>
      <section>
        ${mapView('pharmacy', onview, html`<h2>${message('pharmacy-title')}</h2>`)}
        ${image('5MedicineA')}
        <p>${message('pharmacy')}</p>
        ${image('5MedicineB')}
      </section>
      <section>
        ${mapView('culture', onview, html`<h3>${message('living-title')}</h3>`)}
        ${video('https://vimeo.com/270211741/575052a044', {background: false, placeholderImg: '4chant.jpg'})}
        <p>${message('living')}</p>
        ${image('6CultureB')}
      </section>
      <section>
        ${mapView('conflict-visions', onview, html`<h2>${message('conflict-visions-title')}</h2>`)}
        ${image('IMG_4881')}
        <p>${message('conflict-visions')}</p>
        ${image('7Conflictvisions')}
      </section>
      <section>
        ${mapView('resistance', onview, html`
          <h2>${message('resistance-title')}</h2>`)}
        <p>${message('resistance')}</p>
        ${image('8a')}
        <p>
        ${message('testimony-caption')}</p>
        <p>
        ${video('https://vimeo.com/270212698/62b62abe89', {background: false, placeholderImg: '5testimonies.jpg'})}
        </p>
        <div class='center'>
          <h2>${message('final-title')}</h2>
          <p class="big">${message('final-text')}</p>
          <p class='center'>
            <a class='button-action' href='https://waoresist.amazonfrontlines.org/action/' target='_parent'>
              ${message('action-button')}
            </a>
          </p>
          <p class='small'>
            ${message('final-copyright')}
          </p>
        </div>
      </section>
    </div>
    </div>
    `
}
