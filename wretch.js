// NOTE: does not export Wretcher
const wretch = require('wretch')
const { fetch } = require('./core')

wretch().polyfills({ fetch })

module.exports = wretch
