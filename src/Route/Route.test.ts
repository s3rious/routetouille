import { Route } from './Route'

describe('Route', () => {
  it('can be created', async () => {
    const route = Route({
      name: 'root',
      path: '/',
      beforeMount: async () => {},
      afterMount: async () => {},
      redirects: [[async () => false, async () => undefined]],
      children: [
        Route({
          name: 'child',
          path: 'child/',
          beforeMount: async () => {},
          afterMount: async () => {},
          redirects: [[async () => false, async () => undefined]],
        }),
      ],
    })
    const expected = {
      name: 'root',
      path: '/',
      mounted: false,
      children: [
        {
          name: 'child',
          path: 'child/',
          mounted: false,
        },
      ],
    }

    expect(JSON.stringify(route)).toEqual(JSON.stringify(expected))
    expect(route.match).toBeTruthy()
    expect(route.mount).toBeTruthy()
    expect(route.unmount).toBeTruthy()
  })
})
