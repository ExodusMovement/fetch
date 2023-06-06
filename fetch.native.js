'use strict'

module.exports = typeof fetch === 'undefined' ? require('node-fetch') : fetch
