import tape = require('tape')
import index = require('../src/index')

const { fetchival } = index

function Captor() {
  const captor: CaptorState = {
    calls: [],
    async capture(...args) {
      this.calls.push(args)
      return { status: 204, statusText: 'No Content', json: async () => null, text: async () => '' }
    },
  }
  const capture = captor.capture.bind(captor) as CaptureFunction
  capture.calls = captor.calls

  return capture
}

tape('fetchival', (t) => {
  t.test('fetches json', async () => {
    const res = (await fetchival('https://jsonplaceholder.typicode.com')(
      'posts'
    ).get()) as unknown[]

    t.equals(res.length, 100)
  })

  t.test('fetchival concatenates subpath with base URL', async (t) => {
    const captor = Captor()
    fetchival.fetch = captor

    const client = fetchival(new URL('https://wayne-foundation.com'))('register')

    await client.post({ some: 'data' })

    const [url] = captor.calls[0]!

    t.equals(url, 'https://wayne-foundation.com/register')
  })

  t.test('fetchival concatenates subpath with string base URL', async (t) => {
    const captor = Captor()
    fetchival.fetch = captor

    const client = fetchival('https://wayne-foundation.com')('register')

    await client.post({ some: 'data' })

    const [url] = captor.calls[0]!

    t.equals(url, 'https://wayne-foundation.com/register')
  })
})

interface CaptorState {
  calls: CaptureArgs[]
  capture(...args: CaptureArgs): Promise<CaptureResponse>
}

interface CaptureFunction {
  (...args: CaptureArgs): Promise<CaptureResponse>
  calls: CaptureArgs[]
}

interface CaptureResponse {
  status: number
  statusText: string
  json(): Promise<null>
  text(): Promise<string>
}

type CaptureArgs = [RequestInfo | URL | string, RequestInit?]
