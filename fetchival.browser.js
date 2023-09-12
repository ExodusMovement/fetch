const createFetchival = require('./create-fetchival')

module.exports = createFetchival({
  fetch: typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null,
})
