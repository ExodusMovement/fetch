'use strict'

// This is deprecated, just use global fetch instead
// All supported Node.js versions have it, and the only fallback here was node-fetch

module.exports = globalThis.fetch.bind(globalThis)
