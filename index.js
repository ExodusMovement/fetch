'use strict'

// NOTE: use targeted imports in new code, main import is deprecated

const fetch = require('./fetch')
const WebSocket = require('./websocket')
const fetchival = require('./fetchival')

module.exports = { fetch, WebSocket, fetchival }
