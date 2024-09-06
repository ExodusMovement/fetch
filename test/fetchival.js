const tape = require('@exodus/test/tape')
const fetchival = require('../fetchival')

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
  const res = await fetchival(new URL('https://jsonplaceholder.typicode.com'))('posts').get()

  t.equals(res.length, 100)
})

tape('fetchival concatenates subpath with base URL', async (t) => {
  const captor = Captor()
  globalThis.fetch = captor

  const client = fetchival(new URL('https://wayne-foundation.com'))('register')

  await client.post({ some: 'data' })

  const [url] = captor.calls[0]

  t.deepEqual(url, new URL('https://wayne-foundation.com/register'))
})

tape('fetchival concatenates subpath with string base URL', async (t) => {
  const captor = Captor()
  globalThis.fetch = captor

  const client = fetchival(new URL('https://wayne-foundation.com'))('register')

  await client.post({ some: 'data' })

  const [url] = captor.calls[0]

  t.deepEqual(url, new URL('https://wayne-foundation.com/register'))
})
