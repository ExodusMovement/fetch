const tape = require('tape')
const fetchival = require('../experimental/fetchival')

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

tape('fetchival', (t) => {
  t.test('fetches json', async () => {
    const res = await fetchival(new URL('https://jsonplaceholder.typicode.com'))('posts').get()

    t.equals(res.length, 100)
  })

  t.test('fetchival concatenates subpath with base URL', async (t) => {
    const captor = Captor()
    fetchival.fetch = captor

    const client = fetchival(new URL('https://wayne-foundation.com'))('register')

    await client.post({ some: 'data' })

    const [url] = captor.calls[0]

    t.deepEqual(url, new URL('https://wayne-foundation.com/register'))
  })

  t.test('fetchival concatenates subpath with string base URL', async (t) => {
    const captor = Captor()
    fetchival.fetch = captor

    const client = fetchival(new URL('https://wayne-foundation.com'))('register')

    await client.post({ some: 'data' })

    const [url] = captor.calls[0]

    t.deepEqual(url, new URL('https://wayne-foundation.com/register'))
  })
})
