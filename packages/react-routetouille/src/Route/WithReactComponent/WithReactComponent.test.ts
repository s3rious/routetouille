import { describe, it, expect } from 'vitest';
import * as React from 'react';
import {
  WithReactComponent,
  isWithReactComponent,
  WithReactComponentOptions,
  WithReactComponentInterface,
  WithReactComponentProps,
} from './WithReactComponent.js';

describe('WithReactComponent', () => {
  it('isWithReactComponent returns true for object with component', () => {
    const obj = { component: () => null };
    expect(isWithReactComponent(obj)).toBe(true);
  });

  it('isWithReactComponent returns false for object without component', () => {
    const obj = { notAComponent: true };
    expect(isWithReactComponent(obj)).toBe(false);
  });

  it('isWithReactComponent returns false for non-object', () => {
    expect(isWithReactComponent(null)).toBe(false);
    expect(isWithReactComponent(undefined)).toBe(false);
    expect(isWithReactComponent(123)).toBe(false);
    expect(isWithReactComponent('string')).toBe(false);
  });

  it('WithReactComponent returns an object with component and props', () => {
    const Dummy = () => React.createElement('div', null, 'test');
    const options: WithReactComponentOptions = { component: Dummy };
    const createRoute = (opts: any) => ({ foo: 'bar', ...opts });
    const factory = WithReactComponent(createRoute);
    const result = factory(options);
    expect(result.component).toBe(Dummy);
    expect(result).toHaveProperty('component');
    expect(result.foo).toBe('bar');
  });
});

describe('WithReactComponentOptions type', () => {
  it('should allow assignment of a valid component', () => {
    const Dummy = () => null
    const options: WithReactComponentOptions = { component: Dummy }
    expect(options.component).toBe(Dummy)
  })
}) 