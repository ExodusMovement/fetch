const createFetchival = require('./create-fetchival')

module.exports = createFetchival({
  fetch: (i, ...r) => globalThis.fetch(i, ...r),
})
