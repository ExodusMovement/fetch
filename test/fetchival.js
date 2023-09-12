const test = require('tape')
const { fetchival } = require('../index')

function Captor() {
  const captor = {
    calls: [],
    async capture(...args) {
      this.calls.push(args);
      return { status: 204 }
    }
  }
  const capture = captor.capture.bind(captor)
  capture.calls = captor.calls

  return capture;
}


test('fetchival concatenates subpath with base URL', (t) => {
  const captor = Captor()
  fetchival.fetch = captor

  const client = fetchival(new URL('https://wayne-foundation.com'))('register')

  client.post({ some: 'data' })

  const [url] = captor.calls[0]

  t.equals(url,  'https://wayne-foundation.com/register' )
  t.end()
})

test('fetchival concatenates subpath with string base URL', (t) => {
  const captor = Captor()
  fetchival.fetch = captor

  const client = fetchival('https://wayne-foundation.com')('register')

  client.post({ some: 'data' })

  const [url] = captor.calls[0]

  t.equals(url,  'https://wayne-foundation.com/register' )
  t.end()
})
