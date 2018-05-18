var css = require('sheetify')
var Player = require('@vimeo/player')
var html = require('nanohtml')

const RESIZE_URL = 'https://resizer.digital-democracy.org/600/'
const IMAGE_URL = 'https://s3.amazonaws.com/images.digital-democracy.org/waorani-images/'
const OFFSET_Y = 500
var lastActiveItem = null
var mapDirty = false

function video (url) {
  var options = {
    url: url,
    width: 560,
    title: false,
    loop: false,
    portrait: false,
    byline: false
  }
  var iframePlayer = new Player(document.createElement('div'), options)
  iframePlayer.className = 'lozad'
  return iframePlayer.element
}

function image (path) {
  return html`<img class='lozad' data-src=${RESIZE_URL + IMAGE_URL + path + '.jpg'} />`
}

var wildlifeLayers = [
  'background', 'territory-outline', 'zona-peces', 'zona-animales', 'zona-moretal', 'zona-palmera', 'rivers-large', 'rivers-small',
  'rivers-large-highlight', 'rivers-large-shadow', 'lagos', 'rivers-peru-ecuador-colo', 'rivers-areas-peru-ecuador-colo',
  'country-peru-ecuador-colombia', 'country-peru-ecuador-colombia-dark'
]

var pharmacyLayers = [
  'background', 'territory-outline', 'zona-palmera', 'zona-miwago', 'zona-moretal',
  'zona-animales', 'rivers-large', 'rivers-small', 'rivers-large-highlight',
  'rivers-large-shadow', 'plant-view', 'plant-view-curare', 'rivers-area-per-ecuador-colo',
  'rivers-peru-ecuador-colombia', 'country-peru-ecuador-colombia',
  'country-peru-ecuador-colombia-dark'
]

var layers

function showLayers (map, visibleLayers, defaultVisible) {
  if (!mapDirty) return
  if (!visibleLayers && !defaultVisible) mapDirty = false
  layers.forEach(function (layer) {
    var visibility = defaultVisible || (layer.layout && layer.layout.visibility) || 'visible'
    if (visibleLayers) {
      var visible = wildlifeLayers.indexOf(layer.id) > -1 || layer.id.indexOf('wildlife-view') === 0
      visibility = visible ? 'visible' : 'none'
    }
    map.setLayoutProperty(layer.id, 'visibility', visibility)
  })
}

function zoom (map, opts) {
  opts.speed = 0.15
  map.flyTo(opts)
}

var zoomPoints = {
  '#section-1': function (map) {
    showLayers(map)
    zoom(map, {center: [-79.656232, -0.489971], zoom: 6})
  },
  '#oil-rush': function (map) {
    showLayers(map)
    zoom(map, {center: [-78, -1.204], zoom: 7.5})
  },
  '#maps-and-resistance': function (map) {
    showLayers(map)
    zoom(map, {center: [ -77.27, -1.2322 ], zoom: 14})
  },
  '#wildlife': function (map) {
    mapDirty = true
    showLayers(map, wildlifeLayers, 'none')
    zoom(map, {center: [-77.331, -1.282], zoom: 13})
  },
  '#section-5': function (map) {
    mapDirty = true
    showLayers(map, pharmacyLayers, 'none')
    zoom(map, {center: [-77.278, -1.404], zoom: 13})
  },
  '#section-6': function (map) {
    showLayers(map)
    zoom(map, {center: [-77.535, -1.177], zoom: 14})
  },
  '#conflict-visions': function (map) {
    mapDirty = true
    showLayers(map, ['for-conflict-layer-block', 'for-conflict-layer-petrol'])
    zoom(map, {center: [-77.335, -1.310], zoom: 11.5})
  },
  '#resistance': function (map) {
    mapDirty = true
    showLayers(map, ['final-flora', 'final-comunidades', 'final-water',
      'final-fauna', 'for-conflict-layer-block', 'for-conflict-layer-petrol'])
    zoom(map, {center: [-77.392, -1.273], zoom: 10.6})
  }
}

module.exports = function (map, _layers) {
  layers = _layers
  var style = css`
    :host {
      width: 100%;
      position: fixed;
      overflow-y: scroll;
      max-height: 100%;
      margin-right: -16px;
      background: linear-gradient(to right, rgba(22,22,22, .7), transparent);
      #sidebar {
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
          max-width: 100%;
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

  var el = html`<div id="sidebar-wrapper" class=${style}>
  <div id="sidebar">
      <section id="section-1">
        <h1>IN DEFENSE OF A FOREST HOMELAND</h1>
        ${video('https://vimeo.com/270209852/d857a916b5')}
        <p>
          The Waorani people live in the upper headwaters of the Amazon river in Ecuador, one of the most biodiverse rainforests on earth. Their territory is 2.5 million acres, roughly the size of Yellowstone National Park.
        </p>
        ${image('1e')}
        <p>
          Before the oil companies, the loggers, the rubber tappers, and even before the Spanish conquistadors, the Waorani were known to the Incas and others as fierce defenders of the mountainous forests south of the mighty Napo River and north of the snaking Curaray.
        </p>
        </section>
      <section id="oil-rush">
        <h1>THE OIL RUSH</h1>
        ${image('2a')}
        <p>
        Over the last half-century the oil industry (multinationals and the Ecuadorian state oil company) have opened roads for oil platforms and pipelines into the heart of the Waorani people’s ancestral lands.  Now, the government wants to sell rights to exploit oil in the headwaters of the Curaray River, one of the last remaining oil-free roadless areas in Waorani territory.
        </p>
        ${video('https://vimeo.com/270208622/ee7d7a12cc')}
      </section>
      <section id="maps-and-resistance">
      <h1>MAPS AND RESISTANCE</h1>
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
      <section id="section-4">
        <h1>What is at stake? </h1>
        <h1 id="wildlife">Wildlife</h1>
        ${video('https://vimeo.com/270211119/a857892d50')}
        <p>The Waorani territory protects one of the most biodiverse regions of the world, housing over 200 species of mammals, 600 bird species, nearly 300 fish species, and thousands of insect species. It remains one of the upper Amazon’s last intact wildlife sanctuaries amidst industrial-scale agriculture, oil and mining exploitation and incessant colonial invasion. </p>
        ${image('4WildlifeB')}
      </section>
      <section id="section-5">
        <h1>A Natural Pharmacy</h1>
        ${image('5MedicineA')}
        <p>
        Over millennia of keen observation and experimentation the Waorani people have accumulated knowledge and honed techniques that employ plants, and other peculiar forest items, to heal and cure a host of ailments, such as snake bites, gaping wounds, and even psychological illness. One of their discoveries, <em>curare</em>, used conventionally as a blowgun dart poison, has been employed as the primary muscle relaxant in nearly every surgical operation in the world.
        </p>
        ${image('5MedicineB')}
      </section>
      <section id="section-6">
        <h1>A Culture in balance with Nature</h1>
        ${video('https://vimeo.com/270211741/575052a044')}
        <p>
        Waorani culture embraces the secrets of living a healthy, vibrant, and fearless life within a pristine forested environment and without the need for massive deforestation, resource extraction and irresponsible contamination.  Their way of life uses songs to teach life’s lessons, rear children, memorize history, and to comprehend the complexities of the forest. The Waorani dance to promote family ties and healthy social structure.  Their culture also bears an incredible repertoire of cultural-identifying crafts and iconic weaponry such as chonta wood blowguns and feather-laden spears.
        </p>
        ${image('6CultureB')}
      </section>
      <section id="conflict-visions">
        <h1>A Conflict of Visions</h1>
        ${image('IMG_4881')}
        <p>
        The Waorani way of life requires a healthy living forest. Oil operations in their lands will require the cutting of hundreds of kilometers of dynamite-laden seismic lines, the opening up of oil roads, and the building of pipelines and platforms.  For short-term economic gain, the Ecuadorian Government and the international oil industry are prepared to cause irreparable harm to a millenary indigenous culture, threatening the forest and the rivers that the Waorani depend on for survival.
        </p>
        ${image('7Conflictvisions')}
      </section>
      <section id="resistance">
      <h1>The Resistance</h1>
        <p>
        Armed with 500 years of experience fighting invasions, the Waorani are challenging the government’s plans to exploit oil in their rainforest. They have produced territorial maps documenting the rich biodiversity of their lands, and demonstrating their people’s historical and present-day connection to their forests.  They have organized dozens of community assemblies, building strategies to resist the imminent auctioning of their ancestral territory to the oil industry.
        </p>
        ${image('8a')}
      </section>
      <section id="section-9">
        <h1>Join</h1>
        <p>Sidebar:  Here will be video testimonies...with audio.</p>
      </section>
  </div>
  </div>
  `
  var navigationItems = []
  Object.keys(zoomPoints).forEach(function (selector) {
    var element = el.querySelector(selector)
    if (!element) console.error('Navgation element with selector', selector, 'not found')
    var onScroll = zoomPoints[selector]
    navigationItems.push({element, onScroll})
  })

  el.addEventListener('scroll', function (event) {
    var currentItem
    navigationItems.forEach(function (item) {
      if (event.target.scrollTop >= item.element.offsetTop - OFFSET_Y) currentItem = item
    })
    if (currentItem) {
      if (!lastActiveItem || (currentItem.element !== lastActiveItem.element)) {
        lastActiveItem = currentItem
        currentItem.onScroll(map)
      }
    }
  })

  return el
}
