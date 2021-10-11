import { ModuleRoute } from './ModuleRoute'

describe('ModuleRoute', () => {
  it('can be created', async () => {
    const route = ModuleRoute({
      name: 'root',
      beforeMount: async () => {},
      afterMount: async () => {},
      redirects: [[async () => false, async () => undefined]],
      children: [
        ModuleRoute({
          name: 'child',
          beforeMount: async () => {},
          afterMount: async () => {},
          redirects: [[async () => false, async () => undefined]],
        }),
      ],
    })
    const expected = {
      name: 'root',
      mounted: false,
      children: [
        {
          name: 'child',
          mounted: false,
        },
      ],
    }

    expect(JSON.stringify(route)).toEqual(JSON.stringify(expected))
    expect(route.mount).toBeTruthy()
    expect(route.unmount).toBeTruthy()
  })
})
