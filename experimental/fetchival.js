const createFetchival = require('./create-fetchival')

module.exports = createFetchival({
  fetch: typeof fetch === 'undefined' ? null : (i, ...r) => globalThis.fetch(i, ...r),
})
