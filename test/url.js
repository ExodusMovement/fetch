import tape from '@exodus/test/tape'

import { url, urlBase } from '../url.js'

tape('url', (t) => {
  const check = (val, expected) => {
    t.strictEqual(Object.getPrototypeOf(val), URL.prototype, 'is an URL object')
    t.strictEqual(`${val}`, expected, `value is correct: ${expected}`)
  }

  t.doesNotThrow(() => {
    const base = urlBase('https://example.com/')``
    check(url`${base}${'sd/fds'}/some`, 'https://example.com/sd%2Ffds/some')
    const sub = urlBase('/ffoo/')
    check(url`${base}${'sd/fds'}${sub`bar/j`}`, 'https://example.com/sd%2Ffds/ffoo/bar/j') // eslint-disable-line sonarjs/no-nested-template-literals
  })
  t.doesNotThrow(() => {
    const base = new URL('https://example.com/foo')
    check(url`${base}/sd/fds`, 'https://example.com/foo/sd/fds')
  })
  t.doesNotThrow(() => {
    const base = new URL('https://example.com/foo')
    const arg = 'val/ue'
    check(url`${base}/bar/${arg}`, 'https://example.com/foo/bar/val%2Fue')
  })
  t.doesNotThrow(() => {
    const arg = 'val/ue'
    check(url`https://example.org/buz/${arg}`, 'https://example.org/buz/val%2Fue')
  })
  t.doesNotThrow(() => {
    const arg = { x: 10, b: 20 }
    check(url`https://example.org/buz/?${arg}`, 'https://example.org/buz/?x=10&b=20')
  })
  t.doesNotThrow(() => {
    const arg = new Map(Object.entries({ x: 10, b: 20 }))
    check(url`https://example.org/buz/?d&${arg}`, 'https://example.org/buz/?d&x=10&b=20')
  })

  t.end()
})

// TODO: add failing tests!
