import { TreeRoute } from './TreeRoute'

describe('TreeRoute', () => {
  it('can be created', async () => {
    const route = TreeRoute({
      name: 'root',
      children: [
        TreeRoute({
          name: 'child',
          parent: TreeRoute({
            name: 'root',
          }),
        }),
      ],
    })

    const expected = {
      name: 'root',
      children: [
        {
          name: 'child',
          parent: {
            name: 'root',
          },
        },
      ],
    }

    expect(JSON.stringify(route)).toEqual(JSON.stringify(expected))
  })
})
