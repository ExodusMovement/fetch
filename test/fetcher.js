import tape from '@exodus/test/tape'

import { fetcher } from '../fetcher.js'

function Captor() {
  const captor = {
    calls: [],
    async capture(...args) {
      this.calls.push(args)
      return { status: 204 }
    },
  }
  const capture = captor.capture.bind(captor)
  capture.calls = captor.calls

  return capture
}

tape('fetches json', async (t) => {
  const res = await fetcher(new URL('https://jsonplaceholder.typicode.com'))('posts').get()

  t.equals(res.length, 100)
})

tape('concatenates subpath with base URL', async (t) => {
  const captor = Captor()
  globalThis.fetch = captor

  const client = fetcher(new URL('https://wayne-foundation.com'))('register')

  await client.post({ some: 'data' })

  const [url] = captor.calls[0]

  t.deepEqual(url, new URL('https://wayne-foundation.com/register'))
})

tape('concatenates subpath with string base URL', async (t) => {
  const captor = Captor()
  globalThis.fetch = captor

  const client = fetcher(new URL('https://wayne-foundation.com'))('register')

  await client.post({ some: 'data' })

  const [url] = captor.calls[0]

  t.deepEqual(url, new URL('https://wayne-foundation.com/register'))
})
