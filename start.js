require('babel-core/register')({
  'presets': [
    'env'
    // 'stage-3'
    // 'latest-node'
  ]
})

require('babel-polyfill')
// require('./server')
// require('./server/crawler/imdb_test')
// require('./server/crawler/imdb.js')
// require('./server/crawler/api.js')
// require('./server/crawler/check.js')
require('./server/crawler/wiki.js')