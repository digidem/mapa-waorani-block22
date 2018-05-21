var css = require('sheetify')
var Player = require('@vimeo/player')
var html = require('nanohtml')
var onIntersect = require('on-intersect')

var mapTransition = require('./map_transition')

const RESIZE_URL = 'https://resizer.digital-democracy.org/'
const IMAGE_URL = 'https://s3.amazonaws.com/images.digital-democracy.org/waorani-images/'

var dim = getViewport()

var aspectStyle = css`
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
`

var videoDivStyle = css`
  :host {
    background: center;
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

function section (id, onenter, el) {
  onIntersect(el, function () {
    onenter(id)
  })
  return el
}

function video (url, placeholderImgUrl) {
  // TODO: create placeholder images for videos
  var options = {
    url: url,
    background: true,
    muted: false,
    loop: true,
    title: false,
    portrait: false,
    byline: false
  }
  var el = html`
  <div class=${videoDivStyle} style="background-url: url(${placeholderImgUrl})">
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
    player = new Player(el, options)
    player.element.style.width = '100%'
    player.element.style.height = '100%'
  }

  function onexit () {
    player.destroy()
  }
  return aspectDiv('16x9', el)
}

function image (path) {
  var hasBeenSeen = false
  var fullsize = Math.ceil(dim[0] * 0.45 * window.devicePixelRatio)
  var imageUrl = RESIZE_URL + fullsize + '/' + IMAGE_URL + path + '.jpg'
  var previewUrl = RESIZE_URL + '200/200/30/' + IMAGE_URL + path + '.jpg'
  var el = html`<img src=${previewUrl} />`

  onIntersect(el, function () {
    if (hasBeenSeen) return
    el.src = imageUrl
    hasBeenSeen = true
  })
  return aspectDiv('3x2', el)
}

var style = css`
  :host {
    width: 100%;
    position: fixed;
    overflow-y: scroll;
    max-height: 100%;
    margin-right: -16px;
    transform: translateZ(0);
    background: linear-gradient(to right, rgba(22,22,22, .7), transparent);
    #sidebar {
      transform: translateZ(0);
      margin-left: 20px;
      padding: 20px;
      z-index: 999;
      color: white;
      section {
        padding-top: 100px;
        min-height: 100vh;
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
        line-height: 2rem;
        padding-top: 20px;
      }
      p {
        line-height: 1.75rem;
      }
    }
  }
  @media only screen and (max-width: 600px) {
    :host {
      #sidebar {
        width: 100%;
      }
    }
  }
  @media only screen and (min-width: 601px) {
    :host {
      #sidebar {
        width: 45%;
        max-width: 600px;
        min-width: 300px;
      }
    }
  }
`

module.exports = function (map) {
  function onsection (id) {
    mapTransition(id, map)
  }

  return html`<div id="sidebar-wrapper" class=${style}>
  <div id="sidebar">
      <section>
        ${section('section-1', onsection, html`
          <h1>IN DEFENSE OF A FOREST HOMELAND</h1>`)}
        ${video('https://vimeo.com/270209852/d857a916b5')}
        <p>
          The Waorani people live in the upper headwaters of the Amazon river in Ecuador, one of the most biodiverse rainforests on earth. Their territory is 2.5 million acres, roughly the size of Yellowstone National Park.
        </p>
        ${image('1e')}
        <p>
          Before the oil companies, the loggers, the rubber tappers, and even before the Spanish conquistadors, the Waorani were known to the Incas and others as fierce defenders of the mountainous forests south of the mighty Napo River and north of the snaking Curaray.
        </p>
      </section>
      <section>
        ${section('oil-rush', onsection, html`
          <h1>THE OIL RUSH</h1>`)}
        ${image('2a')}
        <p>
        Over the last half-century the oil industry (multinationals and the Ecuadorian state oil company) have opened roads for oil platforms and pipelines into the heart of the Waorani people’s ancestral lands.  Now, the government wants to sell rights to exploit oil in the headwaters of the Curaray River, one of the last remaining oil-free roadless areas in Waorani territory.
        </p>
        ${video('https://vimeo.com/270208622/ee7d7a12cc')}
      </section>
      <section>
        ${section('maps-and-resistance', onsection, html`
          <h1>MAPS AND RESISTANCE</h1>`)}
        ${image('3a')}
        <p>
          The Waorani communities of the Curaray river-basin (now known as Block 22 by the Government) are creating territorial maps of their lands that document the historic and actual uses of their territory, and demonstrate that their homelands are not up for grabs.
        </p>
        ${image('3b')}
        <p>
          Whereas the maps of oil companies show petrol deposits and major rivers, the maps that the Waorani peoples are creating identify historic battle sites, ancient cave-carvings, jaguar trails, medicinal plants, animal reproductive zones, important fishing holes, creek-crossings, sacred waterfalls.
        </p>
        ${image('3c')}
      </section>
      <section>
        ${section('wildlife', onsection, html`
          <h1>What is at stake? </h1>`)}
        <h1 id="wildlife">Wildlife</h1>
        ${video('https://vimeo.com/270211119/a857892d50')}
        <p>The Waorani territory protects one of the most biodiverse regions of the world, housing over 200 species of mammals, 600 bird species, nearly 300 fish species, and thousands of insect species. It remains one of the upper Amazon’s last intact wildlife sanctuaries amidst industrial-scale agriculture, oil and mining exploitation and incessant colonial invasion. </p>
        ${image('4WildlifeB')}
      </section>
      <section>
        ${section('section-5', onsection, html`
          <h1>A Natural Pharmacy</h1>`)}
        ${image('5MedicineA')}
        <p>
        Over millennia of keen observation and experimentation the Waorani people have accumulated knowledge and honed techniques that employ plants, and other peculiar forest items, to heal and cure a host of ailments, such as snake bites, gaping wounds, and even psychological illness. One of their discoveries, <em>curare</em>, used conventionally as a blowgun dart poison, has been employed as the primary muscle relaxant in nearly every surgical operation in the world.
        </p>
        ${image('5MedicineB')}
      </section>
      <section>
        ${section('section-6', onsection, html`
          <h1>A Culture in balance with Nature</h1>`)}
        ${video('https://vimeo.com/270211741/575052a044')}
        <p>
        Waorani culture embraces the secrets of living a healthy, vibrant, and fearless life within a pristine forested environment and without the need for massive deforestation, resource extraction and irresponsible contamination.  Their way of life uses songs to teach life’s lessons, rear children, memorize history, and to comprehend the complexities of the forest. The Waorani dance to promote family ties and healthy social structure.  Their culture also bears an incredible repertoire of cultural-identifying crafts and iconic weaponry such as chonta wood blowguns and feather-laden spears.
        </p>
        ${image('6CultureB')}
      </section>
      <section>
        ${section('conflict-visions', onsection, html`
          <h1>A Conflict of Visions</h1>`)}
        ${image('IMG_4881')}
        <p>
        The Waorani way of life requires a healthy living forest. Oil operations in their lands will require the cutting of hundreds of kilometers of dynamite-laden seismic lines, the opening up of oil roads, and the building of pipelines and platforms.  For short-term economic gain, the Ecuadorian Government and the international oil industry are prepared to cause irreparable harm to a millenary indigenous culture, threatening the forest and the rivers that the Waorani depend on for survival.
        </p>
        ${image('7Conflictvisions')}
      </section>
      <section>
        ${section('resistance', onsection, html`
          <h1>The Resistance</h1>`)}
        <p>
        Armed with 500 years of experience fighting invasions, the Waorani are challenging the government’s plans to exploit oil in their rainforest. They have produced territorial maps documenting the rich biodiversity of their lands, and demonstrating their people’s historical and present-day connection to their forests.  They have organized dozens of community assemblies, building strategies to resist the imminent auctioning of their ancestral territory to the oil industry.
        </p>
        ${image('8a')}
      </section>
      <section>
        ${section('section-9', onsection, html`
          <h1>Join</h1>`)}
        <p>Sidebar:  Here will be video testimonies...with audio.</p>
      </section>
  </div>
  </div>
  `
}

function getViewport () {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  return [w, h]
}
