var crypto = require('crypto')
const request = require('request')

module.exports = function (urls, cb) {
  var pending = urls.length
  var revisionedUrls = []
  urls.forEach(function (url) {
    getWithHash(url, function (err, hash) {
      if (err) console.error(err)
      revisionedUrls.push({
        url: url,
        revision: hash
      })
      if (!--pending) cb(null, revisionedUrls)
    })
  })
}

function getWithHash (url, cb) {
  request(url, function (err, response, body) {
    if (err) return cb(err)
    var hash = crypto.createHash('md5').update(body).digest('hex')
    cb(null, hash, body)
  })
}
