import { describe, it, expect, vi, afterEach } from 'vitest';
import * as React from 'react';
import { useRouter } from './useRouter.js';
import { Context, type ContextValue } from '../Context/Context.js';

function withContextValue(value: any, children: React.ReactNode) {
  return React.createElement(Context.Provider, { value }, children);
}

describe('useRouter', () => {
  const mockRouter = { getMap: vi.fn(), activate: vi.fn(), active: [] };

  it('returns router from context', () => {
    const { result } = (require('@testing-library/react').renderHook)(() => useRouter(), {
      wrapper: ({ children }: any) => withContextValue({ router: mockRouter }, children),
    });
    expect(result.current).toBe(mockRouter);
  });

  it('returns undefined if context is empty object', () => {
    const { result } = (require('@testing-library/react').renderHook)(() => useRouter(), {
      wrapper: ({ children }: any) => withContextValue({}, children),
    });
    expect(result.current).toBeUndefined();
  });

  it('returns undefined if context is undefined', () => {
    const { result } = (require('@testing-library/react').renderHook)(() => useRouter(), {
      wrapper: ({ children }: any) => withContextValue(undefined, children),
    });
    expect(result.current).toBeUndefined();
  });
}); 