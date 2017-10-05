var translate = require('./translate')
var css = require('sheetify')
var yo = require('yo-yo')

var blacklistProps = ['id', 'version', 'source:gps', 'raiz_grande', 'icon', 'source_gps', 'comunidad', 'preset']
var lookup = {
  'es': 'Nombre Español',
  'en': 'Nombre Ingles',
  'wa': 'Nombre Wao'
}

module.exports = function (opts) {
  if (!opts.feature) throw new Error('need feature')
  if (!opts.lang) opts.lang = 'es'
  var feature = opts.feature
  var symbol = opts.data && opts.data.Symbol[0]
  var name = opts.data && opts.data[lookup[opts.lang]]
  var style = css`
    :host {
      img {
        float: left;
      }
    }
  `
  return yo`<div class="${style}">
    ${symbol ? yo`<img src="${symbol.url}" />` : ``}
    <h3>${name}</h3>
    <table>
      ${Object.keys(feature.properties).map(function (p) {
        if (blacklistProps.indexOf(p) > -1) return
        return yo`<tr><td style="text-align: right;">
          <strong>${translate(p)}</strong></td>
          <td>${translate(feature.properties[p])}</td></tr>
        `
      })}
  </table>
  `
}
