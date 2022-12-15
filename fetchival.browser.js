// Based on https://github.com/typicode/fetchival and aims to keep most of the same API

// Unlike fetchival, we also encode the keys
function query(params) {
  if (!params) return ''
  return `?${Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')}`
}

async function _fetch(method, url, opts, data) {
  // Unlike fetchival, don't silently ignore and override
  if (opts.body) throw new Error('unexpected pre-set body option')

  // Unlike fetchival, don't pollute the opts object we were given
  const res = await fetchival.fetch(url, {
    ...opts,
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  })

  if (res.status >= 200 && res.status < 300) {
    if (opts.responseAs == 'response') return res
    if (res.status == 204) return null
    if (opts.responseAs == 'text') return res.text()
    return res.json()
  }

  const err = new Error(res.statusText)
  err.response = res
  throw err
}

function fetchival(url, opts = {}) {
  const _ = (sub, o = {}) => {
    // TODO: validate subpath here
    return fetchival(`${url}/${sub}`, { ...opts, ...o })
  }

  _.get = (params) => _fetch('GET', url + query(params), opts)
  _.post = (data) => _fetch('POST', url, opts, data)
  _.put = (data) => _fetch('PUT', url, opts, data)
  _.patch = (data) => _fetch('PATCH', url, opts, data)
  _.delete = () => _fetch('DELETE', url, opts)

  return _
}

fetchival.fetch = typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null

module.exports = fetchival
