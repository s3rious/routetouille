import { FallbackRoute } from './FallbackRoute'

describe('FallbackRoute', () => {
  it('can be created', async () => {
    const route = FallbackRoute({
      name: 'fallback',
      beforeMount: async () => {},
      afterMount: async () => {},
      redirects: [[async () => false, async () => undefined]],
    })
    const expected = {
      name: 'fallback',
      fallback: true,
      mounted: false,
    }

    expect(JSON.stringify(route)).toEqual(JSON.stringify(expected))
    expect(route.mount).toBeTruthy()
    expect(route.unmount).toBeTruthy()
  })
})
