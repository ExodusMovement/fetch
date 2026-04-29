'use strict'

// This file is structured this way to allow webpack to optimize out
// the require calls based on hardcoded process.type per bundle.
// Do not refactor or deduplicate.

let webSocketImplementation: WebSocketConstructor

// Try to use global browser APIs (e.g. if in Electron), otherwise require impls
if (typeof process !== 'undefined' && process) {
  const processWithType = process as NodeJS.Process & { type?: string }

  // Node.js or Electron with Node.js integration
  if (processWithType.type === 'renderer' || processWithType.type === 'worker') {
    // Electron renderer with Node.js integration
    webSocketImplementation = globalThis.WebSocket
  } else {
    // Node.js or Electron browser process
    // eslint-disable-next-line unicorn/no-typeof-undefined
    if (typeof globalThis.WebSocket === 'undefined') {
      // Fall back to ws
      webSocketImplementation = require('ws') as WebSocketConstructor
    } else {
      // Prefer Node.js WebSocket if exists
      webSocketImplementation = globalThis.WebSocket
    }
  }
} else {
  // Browser or Electron without Node.js integration
  webSocketImplementation = globalThis.WebSocket
}

export = webSocketImplementation

type WebSocketConstructor = typeof globalThis.WebSocket
