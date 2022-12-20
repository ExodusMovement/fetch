const fetchival = require('./fetchival.browser')
const { fetch } = require('./core')

if (!fetchival.fetch) fetchival.fetch = fetch

module.exports = fetchival
