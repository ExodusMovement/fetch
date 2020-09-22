'use strict'

// Try to use global fetch (e.g. if in Electron), otherwise node-fetch
if (typeof process !== 'undefined' && process) {
  // Node.js or Electron with Node.js integration
  if (process.type === 'renderer' || process.type === 'worker') {
    // Electron renderer with Node.js integration
    module.exports = fetch
  } else {
    // Node.js or Electron browser process
    module.exports = require('node-fetch')
  }
} else {
  // Browser or Electron without Node.js integration
  module.exports = fetch
}
