'use strict'

let fetchImplementation: typeof globalThis.fetch

if (typeof fetch === 'undefined') {
  // Fall back to node-fetch
  fetchImplementation = require('node-fetch') as typeof globalThis.fetch
} else {
  // Prefer native / Node.js fetch if exists
  fetchImplementation = (i, ...r) => globalThis.fetch(i, ...r)
}

export = fetchImplementation
