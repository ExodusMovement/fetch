import fetchival = require('./fetchival.browser')
import fetch = require('./fetch')

if (!fetchival.fetch) fetchival.fetch = fetch

export = fetchival
