import { describe, it, expect, vi } from 'vitest'
import { WithPath } from './WithPath.js'

describe('`WithPath` route', () => {
  it('slug', () => {
    expect(WithPath()({ path: 'path-:foo-:bar/' }).match('path-baz-quz/')).toEqual({ foo: 'baz', bar: 'quz' })
  })

  it('search', () => {
    expect(WithPath()({ path: '?path-:foo=:bar' }).match('?path-baz=quz')).toEqual({ foo: 'baz', bar: 'quz' })
  })

  it('hash', () => {
    expect(WithPath()({ path: '#path-:foo=:bar' }).match('#path-baz=quz')).toEqual({ foo: 'baz', bar: 'quz' })
  })

  it('error', () => {
    // @ts-expect-error
    expect(() => WithPath()({ path: 'foo' })).toThrow()
  })
})
