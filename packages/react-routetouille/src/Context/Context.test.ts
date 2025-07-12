import { describe, it, expect } from 'vitest';
import { createContext } from 'react';
import { Context, type ContextValue } from './Context.js';

function getDefaultValue<T>(context: React.Context<T>): T {
  return (context as any)._currentValue ?? (context as any)._currentValue2;
}

describe('Context', () => {
  it('should be a React context', () => {
    expect(Context).toHaveProperty('Provider');
    expect(Context).toHaveProperty('Consumer');
  });

  it('should have the correct default value', () => {
    const defaultValue = getDefaultValue(Context);
    expect(defaultValue).toEqual({ router: undefined });
  });

  it('should allow providing a custom value', () => {
    const TestContext = createContext<ContextValue>({ router: 123 as any });
    const value = getDefaultValue(TestContext);
    expect(value).toEqual({ router: 123 });
  });
});

describe('ContextValue type', () => {
  it('should allow assignment of a valid router', () => {
    const value: ContextValue = { router: undefined }
    expect(value).toBeDefined()
  })
}) 