const css = require('sheetify')
const elements = require('alianza-elements')
const mapboxgl = require('mapbox-gl')
const querystring = require('querystring')

css('mapbox-gl/dist/mapbox-gl.css')

var qs = querystring.parse(window.location.search)
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g';

var map = window.map = new mapboxgl.Map({
  container: 'map',
  center: [-77.2689, -1.2573],
  zoom: 10,
  maxBounds: [-87, -9, -70, 6],
  style: 'mapbox://styles/aliya/cj5i9q1lb4wnx2rnxmldrtjvt?fresh=true',
  hash: true
})

map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 150,
  unit: 'metric'
}))

var blacklistProps = ['id', 'version', 'source:gps', 'raiz_grande', 'icon', 'source_gps', 'comunidad']

function translate (key) {
  if (typeof key !== 'string') return key
  var str = key
  .replace(/:/, '_')
  .replace(/flora|fauna/, '¿Que?')
  .replace(/^name$/, 'Nombre (wao)')
  .replace(/^name_es$/, 'Nombre (esp)')
  .replace(/^especie_palmera|arbol_especie|planta_especie|mono_especie$/, 'Especie')
  .replace(/^stream$/, 'Quebrada')
  .replace(/^river$/, 'Río')
  .replace(/^waterway$/, 'Agua')
  .replace(/^comunidad_nombre$/, 'Comunidad')
  .replace(/_/, ' ')
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// When a click event occurs near a place, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point);

  if (!features.length) {
    return;
  }

  var feature = features[0];
  console.log(feature)
  var symbol = feature.properties.icon && feature.properties.icon + '-100px'

  var html = `<div class="${symbol}" style="float: left;"></div><table>
  <tr>
  <td style="text-align: right;"><strong>Preset</strong></td>
  <td>${feature.properties.preset || 'no preset defined'}</td>
  </tr>`

  Object.keys(feature.properties)
  .filter(function (p) {
    return blacklistProps.indexOf(p) === -1
  })
  .forEach(function (p) {
    html += `<tr><td style="text-align: right;"><strong>${translate(p)}</strong></td>
    <td>${translate(feature.properties[p])}</td></tr>`
  })

  html += '</table>'

  var coords = feature.geometry.type === 'Point' ? feature.geometry.coordinates : map.unproject(e.point)

  // Populate the popup and set its coordinates
  // based on the feature found.
  var popup = new mapboxgl.Popup({offset: 15})
  .setLngLat(coords)
  .setHTML(html)
  .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point);
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});
