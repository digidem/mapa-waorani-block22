module.exports = {
  'globDirectory': './dist/',
  'globPatterns': [
    '**/*.{js,json,jpg,html,png,css,eot,woff,woff2}'
  ],
  'swDest': 'dist/sw.js',
  'swSrc': './static/sw.js',
  'globIgnores': [
    '../workbox-config.js'
  ]
}
