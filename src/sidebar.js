var css = require('sheetify')
var html = require('nanohtml')

const CONTENT_URL = 'https://s3.amazonaws.com/images.digital-democracy.org/waorani-images/'
const OFFSET_Y = 300
var lastActiveItem = null

function video (path) {
  return html`<video class='lozad' data-src=${CONTENT_URL + path + '.mp4'} autoplay loop />`
}

function image (path) {
  return html`<img class='lozad' data-src=${CONTENT_URL + path + '.jpg'} />`
}

var zoomPoints = {
  '#section-1': function (map) {
    map.easeTo({center: [-79.656232, -0.489971], zoom: 6, duration: 2500})
  },
  '#section-2': function (map) {
    map.easeTo({center: [-78, -1.204], zoom: 7.5, duration: 2500})
  },
  '#section-3': function (map) {
    map.fitBounds([
      [-77.34213519210502, -1.2811817333545292],
      [-77.23773043187386, -1.1856354675856693]
    ])
  }
}

module.exports = function (map) {
  var style = css`
    :host {
      width: 100%;
      position: fixed;
      overflow-y: scroll;
      max-height: 100%;
      margin-right: -16px;
      background: linear-gradient(to right, rgba(22,22,22.7), rgba(22,22,22,.1));
      #sidebar {
        padding: 20px;
        z-index: 999;
        color: white;
        img {
          max-width: 100%;
        }
        video {
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
          width: 50%;
          max-width: 700px;
          min-width: 300px;
        }
      }
    }
  `

  var el = html`<div id="sidebar-wrapper" class=${style}>
  <div id="sidebar">
      <section id="section-1">
        <h1>IN DEFENSE OF A FOREST HOMELAND</h1>
        ${video('1a')}
        <p>
          The Waorani people live in the upper headwaters of the Amazon river in Ecuador, one of the most biodiverse rainforests on earth. Their territory is 2.5 million acres, roughly the size of Yellowstone National Park.
        </p>
        ${image('1e')}
        <p>
          Before the oil companies, the loggers, the rubber tappers, and even before the Spanish conquistadors, the Waorani were known to the Incas and others as fierce defenders of the mountainous forests south of the mighty Napo River and north of the snaking Curaray.
        </p>
        </section>
      <section id="section-2">
        <h1>THE OIL RUSH</h1>
        ${image('2a')}
        <p>
        Over the last half-century the oil industry (multinationals and the Ecuadorian state oil company) have opened roads for oil platforms and pipelines into the heart of the Waorani people’s ancestral lands.  Now, the government wants to sell rights to exploit oil in the headwaters of the Curaray River, one of the last remaining oil-free roadless areas in Waorani territory.
        </p>
        ${video('2b')}
      </section>
      <section id="section-3">
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
        <h1>What are they Protecting? </h1>
        <h1>Wildlife</h1>
        ${video('4wildlifeA')}
        <p>The Waorani territory protects one of the most biodiverse regions of the world, housing over 200 species of mammals, 600 bird species, nearly 300 fish species, and thousands of insect species. It remains one of the upper Amazon’s last intact wildlife sanctuaries amidst industrial-scale agriculture, oil and mining exploitation and incessant colonial invasion. </p>
        ${image('4WildlifeB')}
      </section>
      <section id="section-5">
        <h1>A Natural Pharmacy</h1>
        <p>
        Over millennia of keen observation and experimentation the Waorani people have accumulated knowledge and honed techniques that employ plants, and other peculiar forest items, to heal and cure a host of ailments, such as snake bites, gaping wounds, and even psychological illness. One of their discoveries, <em>curare</em>, used conventionally as a blowgun dart poison, has been employed as the primary muscle relaxant in nearly every surgical operation in the world.
        </p>
      </section>
      <section id="section-6">
        <h1>A Culture in balance with Nature</h1>
        <p>
        Waorani culture embraces the secrets of living a healthy, vibrant, and fearless life within a pristine forested environment and without the need for massive deforestation, resource extraction and irresponsible contamination.  Their way of life uses songs to teach life’s lessons, rear children, memorize history, and to comprehend the complexities of the forest. The Waorani dance to promote family ties and healthy social structure.  Their culture also bears an incredible repertoire of cultural-identifying crafts and iconic weaponry such as chonta wood blowguns and feather-laden spears.
        </p>
      </section>
      <section id="section-7">
        <h1>A Conflict of Visions</h1>
        <p>
        (This text might say something about how the gov’t and oil industry only see beneath the natural pharmacy at the reservoirs below, etc….and how they are capable, for only x years of oil, threatening millenary cultures, biodiversity, and the most important tropical rainforest on the planet, etc.
          </p>
      </section>
      <section id="section-8">
        <p>This text will be about how the Waorani wont let that happen...how the map demonstrates that their territory is not up for grabs)
        Sidebar:  Here will be video testimonies...with audio.
        </p>
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
      if (!lastActiveItem || (currentItem.element !== lastActiveItem.element)) lastActiveItem = currentItem
      currentItem.onScroll(map)
    }
  })

  return el
}
