'use strict'

// NOTE: use targeted imports in new code

const fetch = require('./fetch')
const WebSocket = require('./websocket')
const fetchival = require('./fetchival')
const { createFetchWithHeaders } = require('./with-headers')

module.exports = { fetch, WebSocket, fetchival, createFetchWithHeaders }
