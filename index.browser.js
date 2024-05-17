'use strict'

// Don't need to require node-fetch here, global fetch is defined
// Same for global WebSocket

const fetchival = require('./fetchival.browser.js')
const fetch = require('./fetch.browser.js')

module.exports = { fetch, WebSocket, fetchival }
