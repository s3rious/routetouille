import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { render } from '@testing-library/react'
import { renderRecurse } from './renderRecurse.js'

describe('renderRecurse', () => {
  const router = { active: [], getMap: vi.fn(), activate: vi.fn() };
  it('returns null if no routes', () => {
    const result = renderRecurse(router, [])
    expect(result).toBeNull()
  })

  it('renders a single component for one route', () => {
    const DummyComponent = vi.fn(() => React.createElement('div', null, 'Dummy'))
    const route = { component: DummyComponent }
    const result = renderRecurse(router, [route])
    const { getByText } = render(result)
    expect(getByText('Dummy')).toBeDefined()
  })

  it('renders nested components for multiple routes', () => {
    const DummyComponent = vi.fn(({ children }) => React.createElement('div', null, ['Dummy', children]))
    const route1 = { component: DummyComponent }
    const route2 = { component: DummyComponent }
    const result = renderRecurse(router, [route1, route2])
    const { getAllByText } = render(result)
    expect(getAllByText('Dummy').length).toBeGreaterThan(1)
  })
}) 