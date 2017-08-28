module.exports = function translate (key) {
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
