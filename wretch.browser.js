const { default: wretch } = require('wretch')

// Removes the .default property from the exported function to deconfuse bundlers
module.exports = (url, options) => wretch(url, options)
