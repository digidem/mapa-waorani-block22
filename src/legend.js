const yo = require('yo-yo')
const css = require('sheetify')

module.exports = Legend

const translations = {
  'explore': {
    'es': 'EXPLORAR',
    'en': 'EXPLORE'
  },
  'text': {
    'es': yo`<div>Este mapa muestra parte del territorio ancestral de los waorani en el sudeste de Ecuador. Fue realizado por las comunidades con el apoyo técnico de la Alianza Ceibo para demostrar todos los recursos y lugares de importancia cultural dentro del territorio. Es parte de un proyecto continuo para crear un mapa de todo el territorio waorani.
    <br><br> Toda la información en este mapa es propiedad cultural e intelectual de los waorani y deben ser consultados antes de cualquier reproducción o publicación.</div>`,
    'en': yo`<div>This map shows part of the ancestral territory of the Waorani in South Eastern Ecuador. It was made was made by the communities, with technical support from Alianza Ceibo, in order to show all the resources and important cultural sites that lie within their land. It is part of an ongoing project to map the whole of Waorani territory.
    <br><br>All the information on the map is the cultural and intellectual property of the Waorani and they should be consulted before any reproduction or publication.</div>`
  }
}

function Legend (opts) {
  if (!(this instanceof Legend)) return new Legend(opts)
  if (!opts) opts = {}
  this.lang = opts.lang || 'es'
  this.el = this._getElement()
  document.body.append(this.el)
}

Legend.prototype.updateLang = function (lang) {
  this.lang = lang
  yo.update(this.el, this._getElement())
}

Legend.prototype._getElement = function () {
  var self = this
  var lang = this.lang
  var legendStyles = css`
    :host {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 100%;
      z-index: 1;
      overflow: auto;
      .legend {
        position: relative;
        padding: 30px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        line-height: 18px;
        margin: 40px;
        border-radius: 10px;
        width: 50%;
        min-width: 700px;
        background: rgb(255, 255, 255);
      }

      button {
        width: 100px;
        height: 50px;
        border: 2px solid black;
        font-size: 16px;
        font-weight: bold;
        background: white;
        &:hover {
          background-color: #ddd;
          cursor: pointer;
        }
      }
    }
  `
  var el = yo`<div style="display: none;">
    <div class="map-overlay ${legendStyles}">
      <div class="legend">
        <p>${translations['text'][lang]}</p>
        <button onclick=${close}>${translations['explore'][lang]}</button>
      </div>
    </div>
  </div>
  `
  function close () {
    self.el.style.display = 'none'
  }
  return el
}
