const urlSymbol = Symbol('url')

class WrappedUrl {
  constructor(raw, symbol) {
    if (typeof raw !== 'string')
      throw new TypeError('first argument of WrappedUrl constructor should be of type "string"')
    if (symbol !== urlSymbol) throw new TypeError('Use url`` to construct urls') // Just a double-check against misuse
    this[urlSymbol] = raw
  }
  toString() {
    return this[urlSymbol]
  }
  valueOf() {
    return this[urlSymbol]
  }
}

const urlUnwrap = (url) => {
  if (url instanceof WrappedUrl) return url[urlSymbol]
  throw new TypeError('Input is not a safe wrapped URL string')
}

const encodeComponent = (raw) => {
  if (raw instanceof WrappedUrl) return urlUnwrap(raw)
  if (typeof raw === 'string' || typeof raw === 'number') {
    const arg = String(raw)
    if (arg === '..') throw new Error('Unexpected .. in path')
    return encodeURIComponent(arg)
  }

  throw new TypeError('Unexpected non-primitive component type!')
}

// URI-escape all components of the string
function urlComponent(strings, ...args) {
  if (!strings.raw) throw new TypeError('urlComponent`` should be only used as a template literal')
  const escaped = args.map((arg) => encodeComponent(arg))
  const raw = [strings[0], ...escaped.flatMap((arg, i) => [arg, strings[i + 1]])].join('')
  return new WrappedUrl(raw, urlSymbol)
}

// Returns a template constructor
function urlBase(base) {
  if (typeof base !== 'string') throw new TypeError('Expected a string as base URL')
  return (...args) => {
    const res = urlUnwrap(urlComponent(...args))
    if (!base.endsWith('/') && !res.startsWith('/')) throw new Error('Missing / after base URL')
    return new WrappedUrl(base + res, urlSymbol)
  }
}

function validateBase(url, res) {
  if (typeof url !== 'string' || typeof res !== 'string') throw new TypeError('Unexpected types')
  if (res === url) return
  if (res.startsWith(url) && (url.endsWith('/') || url.endsWith('?') || url.endsWith('&'))) return
  if (res.startsWith(`${url}/`) || res.startsWith(`${url}?`) || res.startsWith(`${url}&`)) return
  throw new Error('Result url does not start with the base url!')
}

function subquery(params) {
  let entries
  if (Object.getPrototypeOf(params) === Map.prototype) {
    entries = [...params]
  } else if (typeof params === 'object' && Object.getPrototypeOf(params) === Object.prototype) {
    entries = Object.entries(params)
  } else throw new TypeError('query can be only a Map or a plain object')
  return entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
}

// Returns an URL() object based on the logic above
function url(strings, ...args) {
  if (!strings.raw) throw new TypeError('url`` should be only used as a template literal')
  let base
  const escaped = args.map((raw, i) => {
    if (raw instanceof URL) {
      if (i === 0 && strings[0] === '') {
        base = String(raw)
        return base
      }

      throw new Error('URL typed argument should always be first')
    } else if (
      Object.getPrototypeOf(raw) === Map.prototype ||
      (typeof raw === 'object' && Object.getPrototypeOf(raw) === Object.prototype)
    ) {
      if (i === args.length - 1 && strings[i + 1] === '') {
        if (!['&', '?'].includes(strings[i].slice(-1))) {
          throw new Error('Missing & or ? before object params!')
        }

        return subquery(raw)
      }

      throw new Error('Object/map params could come only at the end of the URL')
    }

    return encodeComponent(raw)
  })
  const res = [strings[0], ...escaped.flatMap((arg, i) => [arg, strings[i + 1]])].join('')
  if (base) validateBase(base, res)
  const url = new URL(res)
  if (String(url) !== res) throw new Error('Unexpected URL produced!') // e.g. .. which get resolved
  return url
}

export { url, urlComponent, urlBase, urlUnwrap }
