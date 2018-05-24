const request = require('request')

// Images are returned as opaque requests, which we cache without knowing
// if they are returning an error. Here we make sure that the images actually
// exist before adding them to the list to be cached
module.exports = function (urls, cb) {
  var pending = urls.length
  var verifiedUrls = []
  urls.forEach(function (url) {
    request(url, function (err, response) {
      if (err || response.statusCode !== 200) {
        console.error(err)
      } else {
        verifiedUrls.push(url)
      }
      if (!--pending) cb(null, verifiedUrls)
    })
  })
}
