import urlModule = require('../url')
import type {
  ClientMethod,
  ExperimentalCreateFetchivalOptions,
  ExperimentalFetchival,
  ExperimentalFetchivalOptions,
  ExperimentalFetchLike,
  FetchivalError,
  HttpMethod,
  JsonValue,
  QueryParams,
} from '../types'

const { url } = urlModule

function createFetchival({
  fetch = require('../fetch') as ExperimentalFetchLike,
}: ExperimentalCreateFetchivalOptions = {}): ExperimentalFetchival {
  // API somewhat based on https://github.com/typicode/fetchival, but with significant changes

  async function _fetch(
    method: HttpMethod,
    link: URL,
    opts: ExperimentalFetchivalOptions,
    data?: JsonValue
  ) {
    // Unlike fetchival, don't silently ignore and override
    if (opts.body) throw new Error('unexpected pre-set body option')

    // Unlike fetchival, don't pollute the opts object we were given
    const res = await fetchival.fetch(link, {
      timeout: 30_000, // default timeout to 30s, unlike fetchival or fetch
      ...opts,
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...opts.headers,
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    })

    if (res.status >= 200 && res.status < 300) {
      if (opts.responseAs === 'response') return res
      if (res.status === 204) return null
      if (opts.responseAs === 'text') return res.text()
      return res.json()
    }

    const err = new Error(res.statusText) as FetchivalError
    err.response = res
    throw err
  }

  function fetchival(link: URL, opts: ExperimentalFetchivalOptions = {}) {
    if (!(link instanceof URL)) throw new TypeError('Url should be an instance of URL')

    const str = `${link}`
    if (str.includes('?') || str.includes('&')) throw new Error('Invalid url with params!')
    if (str.includes('#')) throw new Error('Invalid url with hash!')

    const _ = (sub: string, o: ExperimentalFetchivalOptions = {}) => {
      // Unlike fetchival, this performs additional validation
      if (sub.includes('/')) throw new Error('Only simple subpaths are allowed!')
      const joined = str.endsWith('/') ? url`${link}${sub}` : url`${link}/${sub}`
      return fetchival(joined, { ...opts, ...o })
    }

    _.head = (params?: QueryParams) => _fetch('HEAD', params ? url`${link}?${params}` : link, opts)
    _.get = (params?: QueryParams) => _fetch('GET', params ? url`${link}?${params}` : link, opts)
    _.post = (data?: JsonValue) => _fetch('POST', link, opts, data)
    _.put = (data?: JsonValue) => _fetch('PUT', link, opts, data)
    _.patch = (data?: JsonValue) => _fetch('PATCH', link, opts, data)
    _.delete = () => _fetch('DELETE', link, opts)
    _.method = (method: ClientMethod, arg?: JsonValue | QueryParams) => {
      switch (method) {
        case 'head':
          return _.head(arg as QueryParams | undefined)
        case 'get':
          return _.get(arg as QueryParams | undefined)
        case 'post':
          return _.post(arg as JsonValue | undefined)
        case 'put':
          return _.put(arg as JsonValue | undefined)
        case 'patch':
          return _.patch(arg as JsonValue | undefined)
        case 'delete':
          return _.delete()
        default:
          throw new Error('Unexpected method')
      }
    }

    return _
  }

  fetchival.fetch = fetch

  return fetchival
}

export = createFetchival
