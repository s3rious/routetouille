import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouterRoot } from './useRouterRoot.js';
import { renderHook, act } from '@testing-library/react';

describe('useRouterRoot', () => {
  let router: any;
  beforeEach(() => {
    router = {
      active: ['route1'],
      history: { emitter: { on: vi.fn() } },
      on: vi.fn(),
      getMap: vi.fn(),
      activate: vi.fn(),
    };
  });

  it('returns router and active', () => {
    const { result } = renderHook(() => useRouterRoot(router));
    expect(result.current.router).toBe(router);
    expect(result.current.active).toEqual(['route1']);
  });

  it('logs active routes if logger and verbose are provided', () => {
    const logger: Console = {
      assert: vi.fn(), clear: vi.fn(), count: vi.fn(), countReset: vi.fn(), debug: vi.fn(), dir: vi.fn(), dirxml: vi.fn(), error: vi.fn(), group: vi.fn(), groupCollapsed: vi.fn(), groupEnd: vi.fn(), info: vi.fn(), log: vi.fn(), table: vi.fn(), time: vi.fn(), timeEnd: vi.fn(), timeLog: vi.fn(), trace: vi.fn(), warn: vi.fn(), profile: vi.fn(), profileEnd: vi.fn(), timeStamp: vi.fn(), memory: {},
    };
    const { result, rerender } = renderHook(
      ({ logger, verbose }) => useRouterRoot(router, { logger, verbose }),
      { initialProps: { logger, verbose: true } },
    );
    act(() => {
      rerender({ logger, verbose: true });
    });
    expect(logger.info).toHaveBeenCalledWith('@Root/active', ['route1']);
  });

  it('subscribes to history emitter and afterActivate', () => {
    renderHook(() => useRouterRoot(router));
    expect(router.history.emitter.on).toHaveBeenCalledWith('change', expect.any(Function));
    expect(router.on).toHaveBeenCalledWith('afterActivate', expect.any(Function));
  });

  it('handles scroll restoration on history change with setTimeout', () => {
    vi.useFakeTimers();
    global.scrollTo = vi.fn();
    const state = { scrollTop: 42, type: 'goTo' };
    renderHook(() => useRouterRoot(router));
    const handler = (router.history.emitter.on as any).mock.calls[0][1];
    act(() => {
      handler('/test', state);
      vi.runAllTimers();
    });
    expect(global.scrollTo).toHaveBeenCalledWith(0, 42);
    vi.useRealTimers();
  });
}); 