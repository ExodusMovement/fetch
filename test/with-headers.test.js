'use strict'

const tape = require('tape')
const { createFetchWithHeaders } = require('../with-headers')

tape('createFetchWithHeaders', (t) => {
  const url = 'https://jsonplaceholder.typicode.com'
  const fetch = createFetchWithHeaders({
    fetch: async (url, opts) => ({ url, opts }),
    headers: { 'x-test': 123 },
  })

  t.test('adds headers', async (t) => {
    const res = await fetch(url)
    t.deepEquals(res, { url, opts: { headers: { 'x-test': 123 } } })
  })

  t.test(`allows overriding headers`, async (t) => {
    const res = await fetch(url, { headers: { 'x-test': 456 } })
    t.deepEquals(res, { url, opts: { headers: { 'x-test': 456 } } })
  })
})
