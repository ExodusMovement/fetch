// Based on https://github.com/typicode/fetchival and aims to keep most of the same API

import type {
  CreateFetchivalOptions,
  Fetchival,
  FetchivalError,
  FetchivalOptions,
  HttpMethod,
  JsonValue,
  LegacyQueryParams,
  UrlInput,
} from './types'

function query(params?: LegacyQueryParams) {
  if (!params) return ''
  return `?${Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')}`
}

function createFetchival({ fetch }: CreateFetchivalOptions): Fetchival {
  async function _fetch(
    method: HttpMethod,
    url: UrlInput,
    opts: FetchivalOptions,
    data?: JsonValue
  ) {
    // Unlike fetchival, don't silently ignore and override
    if (opts.body) throw new Error('unexpected pre-set body option')

    // Unlike fetchival, don't pollute the opts object we were given
    const res = await fetchival.fetch!(url, {
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

  function fetchival(url: UrlInput, opts: FetchivalOptions = {}) {
    const _ = (sub: string, o: FetchivalOptions = {}) => {
      // TODO: validate subpath here
      const str = `${url}`
      const joined = str.endsWith('/') ? `${url}${sub}` : `${url}/${sub}`
      return fetchival(joined, { ...opts, ...o })
    }

    _.get = (params?: LegacyQueryParams) => _fetch('GET', `${url}${query(params)}`, opts)
    _.post = (data?: JsonValue) => _fetch('POST', url, opts, data)
    _.put = (data?: JsonValue) => _fetch('PUT', url, opts, data)
    _.patch = (data?: JsonValue) => _fetch('PATCH', url, opts, data)
    _.delete = () => _fetch('DELETE', url, opts)

    return _
  }

  fetchival.fetch = fetch

  return fetchival
}

export = createFetchival
