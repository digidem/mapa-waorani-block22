const yo = require('yo-yo')
const css = require('sheetify')

module.exports = Legend

const translations = {
  'explore': {
    'es': 'EXPLORAR',
    'en': 'EXPLORE'
  },
  'text': {
    'es': 'Aqui se puede poner información sobre cómo se hizo el mapa, y el contexto del territorio Waorani.',
    'en': 'Here you can put information about how the map was made and other context about Waorani territory.'
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
        text-align: center;
        background: rgb(255, 255, 255);
      }

      button {
        width: 100px;
        height: 50px;
        border: 2px solid black;
        font-size: 16px;
        font-family: 'EB Garamond';
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
    el.style.display = 'none'
  }
  return el


}
