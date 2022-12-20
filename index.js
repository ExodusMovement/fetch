'use strict'

const { fetch, WebSocket } = require('./core')

const fetchival = require('./fetchival') // NOTE: use /fetchival in new code

module.exports = { fetch, WebSocket, fetchival }
