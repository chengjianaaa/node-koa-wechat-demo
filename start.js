require('babel-core/register')({
  'presets': [
    'env'
    // 'stage-3'
    // 'latest-node'
  ]
})

require('babel-polyfill')
// require('./server')
require('./server/crawler/imdb.js')