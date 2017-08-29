var translate = require('./translate')
var yo = require('yo-yo')

var blacklistProps = ['id', 'version', 'source:gps', 'raiz_grande', 'icon', 'source_gps', 'comunidad']

module.exports = function (feature, opts) {
  if (!opts) opts = {}
  var symbol = feature.properties.icon && feature.properties.icon + '-100px'
  return yo`<div>
  <div class="${symbol}" style="float: left;"></div>
    <table>
      <tr>
        <td style="text-align: right;"><strong>Preset</strong></td>
        <td>${feature.properties.preset || 'no preset defined'}</td>
      </tr>
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
