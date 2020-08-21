'use strict'

const fetch = require('./fetch')
const fetchival = require('fetchival')

if (!fetchival.fetch) fetchival.fetch = fetch

module.exports = { fetch, fetchival }
