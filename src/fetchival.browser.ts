import createFetchival = require('./create-fetchival')

export = createFetchival({
  fetch: typeof fetch === 'undefined' ? null : (i, ...r) => globalThis.fetch(i, ...r),
})
