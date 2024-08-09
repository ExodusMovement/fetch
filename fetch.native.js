'use strict'

if (typeof fetch === 'undefined') {
  // Fall back to node-fetch
  module.exports = require('node-fetch')
} else {
  // Prefer native / Node.js fetch if exists
  module.exports = (i, ...r) => globalThis.fetch(i, ...r)
}
