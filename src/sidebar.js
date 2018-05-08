var css = require('sheetify')
var html = require('nanohtml')

var OFFSET_Y = 300
var lastActiveItem = null

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
        .caption {
          text-align: left;
          margin: 5px;
          font-size: .8rem;
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
        <p>
          The Waorani people live in the upper headwaters of the Amazon river in Ecuador, one of the most biodiverse rainforests on earth. Their territory is 2.5 million acres, roughly the size of Yellowstone National Park.
        </p>
        <p>
          Before the oil companies, the loggers, the rubber tappers, and even before the Spanish conquistadors, the Waorani were known to the Incas and others as fierce defenders of the mountainous forests south of the mighty Napo River and north of the snaking Curaray.
        </p>
        <img src="/img/ecuador-flooded-forest.jpg" />
        <div class="caption">Ecuadorian amazon, man in a boat. 2017 </div>
      </section>
      <section id="section-2">
        <h1>THE OIL RUSH</h1>
        <p>
        Over the last half-century the oil industry (multinationals and the Ecuadorian state oil company) have opened roads for oil platforms and pipelines into the heart of the Waorani people’s ancestral lands.  Now, the government wants to sell rights to exploit oil in the headwaters of the Curaray River, one of the last remaining oil-free roadless areas in Waorani territory.
        </p>
      </section>
      <section id="section-3">
        <h1>MAPS AND RESISTANCE</h1>
        <p>The Waorani communities of the Curaray river-basin (now known as Block 22 by the Government) are creating territorial maps of their lands that document the historic and actual uses of their territory, and demonstrate that their homelands are not up for grabs.
          Whereas the maps of oil companies show petrol deposits and major rivers, the maps that the Waorani peoples are creating identify historic battle sites, ancient cave-carvings, jaguar trails, medicinal plants, animal reproductive zones, important fishing holes, creek-crossings, sacred waterfalls.
          </p>
      </section>
      <section id="section-4">
        <h1>Wildlife</h1>
        <p>(There will probably be a couple word Header here...maybe just Wildlife...or maybe something additional like AMAZING AND MIRACULOUS WILDLIFE (HAHA!).  Text will be about about the richness of wildlife in the primary forests of Waorani land, and then a couple lines about the intense knowledge that the Waorani have of the wildlife…as legendary hunters, etc….how in making their maps they identified xxx kilometers of jaguar and peccary trails...and how animals play an important role in their spirituality, health, etc. I Will try to keep it to how many sentences?  3-4 good?
        </p>
      </section>
      <section id="section-5">
        <h1>A Natural Pharmacy</h1>
        <p>(This will we about the thousands and thousands of years of accumulated plant knowledge of the Waorani people...their entire forest is a natural pharmacy...providing examples of some of the sicknesses that their plant medicine can heal…)
          Zoom Level - Would be cool to have the map highlight the plant medicine symbols…?  Mabye with some additional photos popping up?  (And again, if this isn’t a good idea, or isn’t possible...all good, just ideas).
          Sidebar:  jeronimo will produce a short little video for the sidebar.  Another famous Jeronimo "silent motion picture!"
          </p>
      </section>
      <section id="section-6">
        <h1>Culture</h1>
        <p>(This text will focus in on music, dancing, and craftsmanship of the Waorani.  3 sentences)
        (This text will focus in on music, dancing, and craftsmanship of the Waorani.  3 sentences)
        (This text will focus in on music, dancing, and craftsmanship of the Waorani.  3 sentences)
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
