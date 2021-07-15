import { hasParams } from './hasParams'

const slugs: Array<[path: string, result: boolean]> = [
  ['foo/', false],
  ['foo-bar/', false],
  [':id/', true],
  [':post-id/', true],
  [':postId/', true],
  ['post/:id/', true],
  [':first-:second-:third/', true],
]

const queryStringsFirst: Array<[path: string, result: boolean]> = [
  ['?foo', false],
  ['?foo=bar', false],
  ['?:id', true],
  ['?:post-id', true],
  ['?:postId', true],
  ['?post=:id', true],
  ['?:first-:second=:third', true],
]

const queryStringsNonFirst: Array<[path: string, result: boolean]> = [
  ['&foo', false],
  ['&foo=bar', false],
  ['&:id', true],
  ['&:post-id', true],
  ['&:postId', true],
  ['&post=:id', true],
  ['&:first-:second=:third', true],
]

const hashes: Array<[path: string, result: boolean]> = [
  ['#foo', false],
  ['#foo-bar', false],
  ['#:id', true],
  ['#:post-id', true],
  ['#:postId', true],
  ['#post-:id', true],
  ['#:first-:second-:third', true],
]

const paths: Array<[path: string, result: boolean]> = [
  ...slugs,
  ...queryStringsFirst,
  ...queryStringsNonFirst,
  ...hashes,
]

describe('hasParams', () => {
  it('matches properly', () => {
    paths.forEach(([path, result]) => {
      expect(hasParams(path)).toBe(result)
    })
  })
})
