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

  t.test('does not stringify body for specific Conent-Type headers', async (t) => {
    let capturedOpts
    const formData = 'name=John&age=30'
    const fetch = async (url, opts) => {
      capturedOpts = opts
      return { status: 200, json: async () => ({ success: true }) }
    }

    const fetchival = createFetchival({ fetch })

    await fetchival('https://example.com')('api', {
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
      },
    }).post(formData)

    t.equals(
      capturedOpts.body,
      formData,
      'body should not be stringified for non-JSON content type'
    )
    t.equals(capturedOpts.headers['Content-Type'], 'application/x-sentry-envelope')
  })

  t.test('applies JSON.stringify to body by default', async (t) => {
    let capturedOpts
    const formData = 'name=John&age=30'
    const fetch = async (url, opts) => {
      capturedOpts = opts
      return { status: 200, json: async () => ({ success: true }) }
    }

    const fetchival = createFetchival({ fetch })

    await fetchival('https://example.com')('api').post(formData)

    t.equals(
      capturedOpts.body,
      JSON.stringify(formData),
      'body should not be stringified for non-JSON content type'
    )
    t.equals(capturedOpts.headers['Content-Type'], 'application/json')
  })
})
