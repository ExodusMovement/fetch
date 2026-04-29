// NOTE: does not export Wretcher
import wretch = require('./wretch.browser')
import fetch = require('./fetch')

wretch().polyfills({ fetch })

export = wretch
