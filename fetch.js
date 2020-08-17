'use strict'

// Try to use window.fetch (e.g. if in Electron), otherwise node-fetch
// Doesn't use non-window global fetch if present as a precaution, but that might change
module.exports = typeof window !== 'undefined' && window.fetch || require('node-fetch')
