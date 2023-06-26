// API somewhat based on https://github.com/typicode/fetchival, but with significant changes

const { url } = require('../url')
const fetch = require('../fetch')

async function _fetch(method, link, opts, data) {
  // Unlike fetchival, don't silently ignore and override
  if (opts.body) throw new Error('unexpected pre-set body option')

  // Unlike fetchival, don't pollute the opts object we were given
  const res = await fetch(link, {
    timeout: 30000, // default timeout to 30s, unlike fetchival or fetch
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

function fetchival(link, opts = {}) {
  if (!(link instanceof URL)) throw new TypeError('Url should be an instance of URL')

  const str = `${link}`
  if (str.includes('?') || str.includes('&')) throw new Error('Invalid url with params!')
  if (str.includes('#')) throw new Error('Invalid url with hash!')

  const _ = (sub, o = {}) => {
    // Unlike fetchival, this performs additional validation
    if (sub.includes('/')) throw new Error('Only simple subpaths are allowed!')
    const joined = str.endsWith('/') ? url`${link}${sub}` : url`${link}/${sub}`
    return fetchival(joined, { ...opts, ...o })
  }

  _.head = (params) => _fetch('HEAD', params ? url`${link}?${params}` : link, opts)
  _.get = (params) => _fetch('GET', params ? url`${link}?${params}` : link, opts)
  _.post = (data) => _fetch('POST', link, opts, data)
  _.put = (data) => _fetch('PUT', link, opts, data)
  _.patch = (data) => _fetch('PATCH', link, opts, data)
  _.delete = () => _fetch('DELETE', link, opts)
  _.method = (method, ...args) => {
    switch (method) {
      case 'head':
        return _.head(...args)
      case 'get':
        return _.get(...args)
      case 'post':
        return _.post(...args)
      case 'put':
        return _.put(...args)
      case 'patch':
        return _.patch(...args)
      case 'delete':
        return _.delete(...args)
      default:
        throw new Error('Unexpected method')
    }
  }

  return _
}

module.exports = fetchival
