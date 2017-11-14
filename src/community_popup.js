var css = require('sheetify')
var yo = require('yo-yo')

var lookup = {
  'es': 'Nombre Español',
  'en': 'Nombre Ingles',
  'wa': 'Nombre Wao'
}

module.exports = function (opts) {
  if (!opts.feature) throw new Error('need feature')
  if (!opts.lang) opts.lang = 'es'
  var symbol = opts.data && opts.data.Symbol[0]
  var name = (opts.data && opts.data[lookup[opts.lang]]) || opts.feature.properties.Nombre
  var style = css`
    :host {
      margin: 10px;
      img {
        width: 100%;
      }
    }
  `
  return yo`<div class="${style}">
    ${symbol ? yo`<img src="${symbol.url}" />` : ``}
    <h3>${name}</h3>
  </div>
  `
}
