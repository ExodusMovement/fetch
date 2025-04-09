// NOTE: does not export Wretcher
const wretch = require('./wretch.browser')
const fetch = require('./fetch')

wretch().polyfills({ fetch })

module.exports = wretch
