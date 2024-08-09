'use strict'

// NOTE: use targeted imports in new code, main import is deprecated

// Don't need to require ws here, global WebSocket is defined

const fetchival = require('./fetchival.js')
const fetch = require('./fetch.js')

module.exports = { fetch, WebSocket, fetchival }
