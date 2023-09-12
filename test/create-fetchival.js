'use strict'

const tape = require('tape')
const createFetchival = require('../create-fetchival')

tape('createFetchival', (t) => {
  t.test('uses injected fetch to fetch json', async (t) => {
    const data = { identity: 'Bruce Wayne' }
    const fetch = async () => {
      return { status: 200, json: async () => data }
    }

    const fetchival = createFetchival({ fetch })

    const res = await fetchival('https://jsonplaceholder.typicode.com')('posts').get()

    t.equals(res, data)
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
    } catch (err) {
      t.equals(err.message, 'Couldnt establish connection')
    }
  })
})
