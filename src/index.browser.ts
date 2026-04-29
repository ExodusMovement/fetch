'use strict'

// Don't need to require node-fetch here, global fetch is defined
// Same for global WebSocket

import fetchival = require('./fetchival.browser')
import fetch = require('./fetch.browser')

export = { fetch, WebSocket: globalThis.WebSocket, fetchival }
