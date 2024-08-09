'use strict'

// This file is structured this way to allow webpack to optimize out
// the require calls based on hardcoded process.type per bundle.
// Do not refactor or deduplicate.

// Try to use global browser APIs (e.g. if in Electron), otherwise require impls
if (typeof process !== 'undefined' && process) {
  // Node.js or Electron with Node.js integration
  if (process.type === 'renderer' || process.type === 'worker') {
    // Electron renderer with Node.js integration
    module.exports = (i, ...r) => globalThis.fetch(i, ...r)
  } else {
    // Node.js or Electron browser process
    if (typeof fetch === 'undefined') {
      // Fall back to node-fetch
      module.exports = require('node-fetch')
    } else {
      // Prefer Node.js fetch if exists
      module.exports = (i, ...r) => globalThis.fetch(i, ...r)
    }
  }
} else {
  // Browser or Electron without Node.js integration
  module.exports = (i, ...r) => globalThis.fetch(i, ...r)
}
