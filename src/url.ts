const urlSymbol = Symbol('url')

class WrappedUrl {
  constructor(raw: string, symbol: typeof urlSymbol) {
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

  private readonly [urlSymbol]: string
}

const urlUnwrap = (url: WrappedUrl) => {
  if (url instanceof WrappedUrl) return url[urlSymbol]
  throw new TypeError('Input is not a safe wrapped URL string')
}

const encodeComponent = (raw: UrlComponentInput) => {
  if (raw instanceof WrappedUrl) return urlUnwrap(raw)
  if (typeof raw === 'string' || typeof raw === 'number') {
    const arg = String(raw)
    if (arg === '..') throw new Error('Unexpected .. in path')
    return encodeURIComponent(arg)
  }

  throw new TypeError('Unexpected non-primitive component type!')
}

// URI-escape all components of the string
function urlComponent(strings: TemplateStringsArray, ...args: UrlComponentInput[]) {
  if (!strings.raw) throw new TypeError('urlComponent`` should be only used as a template literal')
  const escaped = args.map((arg) => encodeComponent(arg))
  const raw = [strings[0] ?? '', ...escaped.flatMap((arg, i) => [arg, strings[i + 1] ?? ''])].join(
    ''
  )
  return new WrappedUrl(raw, urlSymbol)
}

// Returns a template constructor
function urlBase(base: string) {
  if (typeof base !== 'string') throw new TypeError('Expected a string as base URL')
  return (...args: Parameters<typeof urlComponent>) => {
    const res = urlUnwrap(urlComponent(...args))
    if (!base.endsWith('/') && !res.startsWith('/')) throw new Error('Missing / after base URL')
    return new WrappedUrl(base + res, urlSymbol)
  }
}

function validateBase(url: string, res: string) {
  if (typeof url !== 'string' || typeof res !== 'string') throw new TypeError('Unexpected types')
  if (res === url) return
  if (res.startsWith(url) && (url.endsWith('/') || url.endsWith('?') || url.endsWith('&'))) return
  if (res.startsWith(`${url}/`) || res.startsWith(`${url}?`) || res.startsWith(`${url}&`)) return
  throw new Error('Result url does not start with the base url!')
}

function subquery(params: QueryParams) {
  let entries: QueryEntries
  if (Object.getPrototypeOf(params) === Map.prototype) {
    entries = [...(params as Map<string, QueryValue>)]
  } else if (typeof params === 'object' && Object.getPrototypeOf(params) === Object.prototype) {
    entries = Object.entries(params as Record<string, QueryValue>)
  } else throw new TypeError('query can be only a Map or a plain object')
  return entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

// Returns an URL() object based on the logic above
function url(strings: TemplateStringsArray, ...args: UrlInput[]) {
  if (!strings.raw) throw new TypeError('url`` should be only used as a template literal')
  let base: string | undefined
  const escaped = args.map((raw, i) => {
    if (raw instanceof URL) {
      if (i === 0 && strings[0] === '') {
        base = String(raw)
        return base
      }

      throw new Error('URL typed argument should always be first')
    } else if (isQueryParams(raw)) {
      if (i === args.length - 1 && strings[i + 1] === '') {
        if (!/^[&?]$/.test((strings[i] ?? '').slice(-1))) {
          throw new Error('Missing & or ? before object params!')
        }

        return subquery(raw as QueryParams)
      }

      throw new Error('Object/map params could come only at the end of the URL')
    }

    return encodeComponent(raw as UrlComponentInput)
  })
  const res = [strings[0] ?? '', ...escaped.flatMap((arg, i) => [arg, strings[i + 1] ?? ''])].join(
    ''
  )
  if (base) validateBase(base, res)
  const url = new URL(res)
  if (String(url) !== res) throw new Error('Unexpected URL produced!') // e.g. .. which get resolved
  return url
}

export = { url, urlComponent, urlBase, urlUnwrap }

type QueryEntries = [string, QueryValue][]
type QueryParams = Map<string, QueryValue> | Record<string, QueryValue>
type QueryValue = boolean | null | number | string
type UrlComponentInput = WrappedUrl | number | string
type UrlInput = QueryParams | URL | UrlComponentInput

function isQueryParams(value: UrlInput): value is QueryParams {
  if (value instanceof Map) return true
  return (
    typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype
  )
}
