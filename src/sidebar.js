var css = require('sheetify')
var html = require('nanohtml')

var OFFSET_Y = 300

var zoomPoints = {
  '#section-1': function (map) {
    console.log('section 1', map)
  },
  '#section-2': function (map) {
    console.log('section 2', map)
  },
  '#section-3': function (map) {
    console.log('section 3', map)
  }
}

var lastActiveItem = null
module.exports = function (map) {
  var style = css`
    :host {
      width: 30%;
      max-width: 500px;
      z-index: 999;
      background-color: #161616;
      color: white;
      max-height: 100%;
      position: fixed;
      overflow-y: scroll;
    }
    :host::-webkit-scrollbar {
      display: none;
    }
  `

  var el = html`
    <div class=${style}>
      <section id="section-1">
        <h1>IN DEFENSE OF A FOREST HOMELAND</h1>
        <p>
          The Waorani people live in the upper headwaters of the Amazon river in Ecuador, one of the most biodiverse rainforests on earth. Their territory is 2.5 million acres, roughly the size of Yellowstone National Park.
        </p>
        <p>
          Before the oil companies, the loggers, the rubber tappers, and even before the Spanish conquistadors, the Waorani were known to the Incas and others as fierce defenders of the mountainous forests south of the mighty Napo River and north of the snaking Curaray.
        </p>
      </section>
      <section id="section-2">
        <h2>THE OIL RUSH</h2>
        <p>Over the last half-century the oil industry (multinationals and the Ecuadorian state oil company) have opened roads for oil platforms and pipelines into the heart of the Waorani people’s ancestral lands.  Now, the government wants to sell rights to exploit oil in the headwaters of the Curaray River, one of the last remaining oil-free roadless areas in Waorani territory. </p>
      </section>
      <section id="section-3">
        <h3>MAPS AND RESISTANCE</h3>
        <p>The Waorani communities of the Curaray river-basin (now known as Block 22 by the Government) are creating territorial maps of their lands that document the historic and actual uses of their territory, and demonstrate that their homelands are not up for grabs.
          Whereas the maps of oil companies show petrol deposits and major rivers, the maps that the Waorani peoples are creating identify historic battle sites, ancient cave-carvings, jaguar trails, medicinal plants, animal reproductive zones, important fishing holes, creek-crossings, sacred waterfalls.</p>
      </section>
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
