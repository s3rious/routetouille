import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock react-dom before importing the module under test
;(globalThis as any).__TEST_DISABLE_CREATE_ROOT__ = true
vi.mock('react-dom/client', () => {
  return { createRoot: undefined }
})
const renderMock = vi.fn()
vi.mock('react-dom', async () => {
  // Only mock render, leave unmountComponentAtNode as is
  const actual = await vi.importActual<any>('react-dom')
  return {
    ...actual,
    render: renderMock,
    createRoot: undefined,
  }
})

describe('WithReactRoot fallback to render (module-level mock)', () => {
  let WithReactRoot: any
  beforeEach(async () => {
    // Dynamically import after mock is in place
    const mod = await import('./WithReactRoot')
    WithReactRoot = mod.WithReactRoot
    renderMock.mockClear()
  })

  afterEach(() => {
    const existing = document.getElementById('test-root-fallback')
    if (existing) existing.remove()
  })

  it('calls render if createRoot is not available and container does not exist', async () => {
    const Dummy = () => null
    const options = {
      id: 'test-root-fallback',
      router: {} as any,
      component: Dummy,
    }
    const createRoute = (opts: any) => opts
    const factory = WithReactRoot(createRoute)
    await factory(options).beforeMount()
    expect(document.getElementById('test-root-fallback')).not.toBeNull()
    expect(renderMock).toHaveBeenCalled()
  })
}) 