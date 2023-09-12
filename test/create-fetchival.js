'use strict'

const tape = require('tape')
const createFetchival = require('../create-fetchival')
const fetch = require('../fetch')

tape('createFetchival', (t) => {
  t.test('uses injected fetch to fetch json', async (t) => {
    const fetchival = createFetchival({ fetch })

    const res = await fetchival('https://jsonplaceholder.typicode.com')('posts').get()

    t.equals(res.length, 100)
  })

  t.test('throws when injected fetch throws', async (t) => {
    const fetchival = createFetchival({
      fetch: () => {
        throw new Error('Couldnt establish connection')
      },
    })

    try {
      await fetchival('https://jsonplaceholder.typicode.com')('posts').get()
      t.fail('request should have failed')
    } catch {
      t.pass()
    }
  })
})
