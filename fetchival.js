const fetchival = require('./fetchival.browser')
const fetch = require('./fetch')

if (!fetchival.fetch) fetchival.fetch = fetch

module.exports = fetchival
