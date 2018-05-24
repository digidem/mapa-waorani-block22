var verifyUrls = require('./verify-urls')

module.exports = getImageUrls

function getImageUrls (str, cb) {
  var urls = []
  urls = urls.concat(matchAll(str, /<img[^>]+src="(http[^">]+)"/g))
  urls = urls.concat(matchAll(str, /-image:\s?url\((http[^)]+)\)/g))
  verifyUrls(urls, cb)
}

function matchAll (str, re) {
  var m
  var results = []

  do {
    m = re.exec(str)
    if (m) results.push(m[1])
  } while (m)

  return results
}
