const fetchival = require('fetchival')
const { fetch } = require('./core')

if (!fetchival.fetch) fetchival.fetch = fetch

module.exports = fetchival
