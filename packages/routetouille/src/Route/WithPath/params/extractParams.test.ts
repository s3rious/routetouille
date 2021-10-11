import { extractParams } from './extractParams'

type Result = { [key: string]: string } | false

const slugs: Array<[path: string, part: string, result: Result]> = [
  ['foo/', 'foo/', false],
  ['foo-bar/', 'foo-bar/', false],
  [':id/', '34/', { id: '34' }],
  [':post-id/', '42-id/', { post: '42' }],
  [':postId/', '69/', { postId: '69' }],
  ['post/:id/', 'post/666/', { id: '666' }],
  [':first-:second-:third/', 'foo-bar-3/', { first: 'foo', second: 'bar', third: '3' }],
  [':id/', '', false],
  ['first-to-be-:false/', 'totally-another-path-really/', false],
  [':id/', 'false-42/', false],
]

const queryStringsFirst: Array<[path: string, part: string, result: Result]> = [
  ['?foo', '?foo', false],
  ['?foo=bar', '?foo=bar', false],
  ['?:id', '?34', { id: '34' }],
  ['?:post-id', '?42-id', { post: '42' }],
  ['?:postId', '?69', { postId: '69' }],
  ['?post=:id', '?post=666', { id: '666' }],
  ['?:first-:second=:third', '?foo-bar=3', { first: 'foo', second: 'bar', third: '3' }],
  ['?first-to-be=:false', '?totally-another-path=really', false],
]

const queryStringsNonFirst: Array<[path: string, part: string, result: Result]> = [
  ['&foo', '&foo', false],
  ['&foo=bar', '&foo=bar', false],
  ['&:id', '&34', { id: '34' }],
  ['&:post-id', '&42-id', { post: '42' }],
  ['&:postId', '&69', { postId: '69' }],
  ['&post=:id', '&post=666', { id: '666' }],
  ['&:first-:second=:third', '&foo-bar=3', { first: 'foo', second: 'bar', third: '3' }],
  ['&first-to-be=:false', '&totally-another-path=really', false],
]

const hashes: Array<[path: string, part: string, result: Result]> = [
  ['#foo', '#foo', false],
  ['#foo-bar', '#foo-bar', false],
  ['#:id', '#34', { id: '34' }],
  ['#:post-id', '#42-id', { post: '42' }],
  ['#:postId', '#69', { postId: '69' }],
  ['#post-:id', '#post-666', { id: '666' }],
  ['#:first-:second-:third', '#foo-bar-3', { first: 'foo', second: 'bar', third: '3' }],
  ['#first-to-be=:false', '#totally-another-path=really', false],
]

const paths: Array<[path: string, part: string, result: Result]> = [
  ...slugs,
  ...queryStringsFirst,
  ...queryStringsNonFirst,
  ...hashes,
]

describe('hasParams', () => {
  it('matches properly', () => {
    paths.forEach(([path, part, result]) => {
      expect(JSON.stringify(extractParams(path, part))).toEqual(JSON.stringify(result))
    })
  })
})
