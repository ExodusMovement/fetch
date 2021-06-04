'use strict'

// fetch and WebSocket already exist in react-native, we don't want to bundle impls
// for node tests in mobile though this will throw
module.exports = { fetch: typeof fetch === 'undefined' ? require('node-fetch') : fetch, WebSocket }
