const css = require('sheetify')
const html = require('nanohtml')
const raw = require('nanohtml/raw')
const onIntersectOrig = require('on-intersect')

var ZoomableImage = require('./image')
var ZoomableVideo = require('./video')

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

const IMAGE_URL = 'https://images.digital-democracy.org/waorani-images/'

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
  return ZoomableVideo().render({
    placeholder: IMAGE_URL + opts.placeholderImg,
    url: url,
    background: opts.background
  })
}

function image (path) {
  return ZoomableImage().render(IMAGE_URL + path + '.jpg')
}

var style = css`
  :host {
    width: 100%;
    position: fixed;
    z-index: 2;
    height: 100%;
    overflow: hidden;
    transform: translateZ(0);
    #scroll-container {
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%
    }
    #sidebar {
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
      p.footnote {
        font-size: .8em;
        padding-top: 20px;
        color: #ccc;
        a {
          color: #fff;
        }
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
      #scroll-container {
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }
  @media only screen and (min-width: 601px) {
    :host {
      background: linear-gradient(to right, rgba(22,22,22, .6), rgba(22,22,22, .4) 40%, rgba(22,22,22, .2) 60%, transparent 70%);
      #sidebar {
        padding-left: 20px;
        width: 45%;
        box-sizing: border-box;
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
  <div id="scroll-container">
    <div id="sidebar">
      <section>
        ${mapView('start', onview, html`<h1>${message('title')}</h1>`)}
        ${video('https://vimeo.com/270209852/d857a916b5', {
          background: true,
          placeholderImg: '1territory.jpg'})}
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
        ${video('https://vimeo.com/270208622/ee7d7a12cc', {
          background: true,
          placeholderImg: '2oil.jpg'})}
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
        ${video('https://vimeo.com/270211119/a857892d50', {
          background: true,
          placeholderImg: '3wildlife.jpg'})}
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
        ${video('https://vimeo.com/270211741/575052a044', {
          background: false,
          placeholderImg: '4chant.jpg'})}
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
        ${video('https://vimeo.com/270212698/62b62abe89', {
          background: false,
          placeholderImg: '5testimonies.jpg'})}
        </p>
        <div class='center'>
          <h2>${message('final-title')}</h2>
          <p class="big">${message('final-text')}</p>
          <p class='center'>
            <a class='button-action' href=${message('action-link')} target='_parent'>
              ${message('action-button')}
            </a>
          </p>
          <p class='footnote'>
            ${raw(message('final-copyright'))}
          </p>
        </div>
      </section>
    </div>
  </div>
  </div>`
}
