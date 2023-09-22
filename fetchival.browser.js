const createFetchival = require('./create-fetchival')

module.exports = createFetchival({
  fetch: typeof fetch === 'undefined' ? null : fetch.bind(globalThis),
})
