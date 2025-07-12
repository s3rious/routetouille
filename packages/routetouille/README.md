# Routetouille

> **A new breed of JavaScript router: hackable, extendable, framework-agnostic, isomorphic, and lifecycle-driven.**

---

## What does "Routetouille" mean?

**Routetouille** is a blend of "route" and "ratatouille"—just as ratatouille is a dish made from diverse, harmonious ingredients, Routetouille is a router designed to be composed, extended, and enjoyed in many flavors. It brings together the best ingredients of modern routing: lifecycle, extensibility, and framework-agnostic design.

---

## Philosophy

Routetouille is designed for ambitious applications and libraries that demand:
- **Lifecycle hooks** for routes, enabling data fetching, analytics, and resource management.
- **Total hackability**—compose, extend, or override any behavior, including route types and history strategies.
- **Framework-agnostic** core: works with React, Vue, Svelte, or vanilla JS.
- **Isomorphic**: supports browser, server, and custom histories.
- **Composable, type-safe API** for modern TypeScript/JavaScript.

---

## Why Routetouille?

- **Lifecycle-first:** Each route has `beforeMount`, `afterMount`, `beforeUnmount`, and `afterUnmount` hooks for full control.
- **Extensible by design:** Add custom behaviors, route types, or history strategies.
- **No framework lock-in:** Use with or without UI frameworks.
- **Isomorphic routing:** Works in browsers, SSR, or custom environments.
- **Composable, declarative API:** Build route trees and behaviors with plain objects and functions.
- **Battle-tested:** Used in complex, real-world apps.

---

## Quickstart

### Installation

```sh
npm install routetouille
# or
yarn add routetouille
```

### Minimal Example

```typescript
import { Router, Route, FallbackRoute, BrowserHistory } from 'routetouille';

const router = Router({
  history: BrowserHistory(),
  root: Route({
    name: 'main',
    path: '/',
    afterMount: () => {
      document.getElementById('root').innerHTML = `<h1>Main page</h1>`;
    },
    children: [
      Route({
        name: 'foo',
        path: 'foo/',
        afterMount: () => {
          document.getElementById('root').innerHTML = `<h1>Foo</h1>`;
        },
      }),
      FallbackRoute({
        name: '404',
        afterMount: () => {
          document.getElementById('root').innerHTML = `<h1>404 Not Found</h1>`;
        },
      }),
    ],
  }),
});

router.init();
```

---

## Core Concepts

### Router
- **`Router(options)`**: Creates a router instance.
  - `root`: The root route (see below).
  - `history`: History provider (e.g., `BrowserHistory`).
  - `optimistic?`: If true, updates active routes instantly for snappier UX.

### Route Types
- **`Route`**: Standard route with a path and lifecycle hooks.
- **`ModuleRoute`**: Logical grouping of routes, no path.
- **`FallbackRoute`**: Handles unmatched paths (404s).

### Lifecycle Hooks
- `beforeMount`: Runs before route is mounted (e.g., blocking data fetch).
- `afterMount`: Runs after route is mounted (e.g., analytics, async fetch).
- `beforeUnmount`: Runs before route is unmounted (e.g., validation).
- `afterUnmount`: Runs after route is unmounted (e.g., cleanup).

### History Providers
- **`BrowserHistory`**: Uses the browser’s History API.
- **Custom**: Implement the `HistoryInterface` for SSR, memory, or other environments.

---

## API Reference

### Router Methods
- **`init(): Promise<void>`** — Bind router to history and start listening.
- **`goTo(activator, options?): Promise<void>`** — Activate a route by name, path, or array.
- **`urlTo(activator, params?): string`** — Get the URL for a route and params.
- **`set(path, optimistic?): Promise<void>`** — Activate a route by path.
- **`getMap(): Map<RouteMapKey, RouteMapRoute>`** — Inspect the route tree.
- **`on(event, callback): () => void`** — Subscribe to lifecycle events.

### Route Options
- `name: string` — Unique route name (recommended: kebab-case).
- `path: string` — Path, query, or hash (e.g., `/`, `foo/`, `?edit`, `#share`).
- `children?: AbstractRoute[]` — Nested routes.
- `beforeMount?`, `afterMount?`, `beforeUnmount?`, `afterUnmount?`: Lifecycle hooks.
- `redirects?`: Array of redirect tuples (see advanced usage).

---

## Advanced Usage

### Parametrized Routes
```typescript
Route({
  name: 'post',
  path: ':postId/',
  afterMount: async () => {
    const id = getParam(router.params, 'postId');
    await fetchPost(id);
  },
});
```

### Custom History Provider
```typescript
type HistoryInterface = {
  pathname: string | null;
  push: (pathname: string | null, state?: unknown) => void;
  replace: (pathname: string | null, state?: unknown) => void;
  emitter: Emitter<Events>;
};
```

### Extending Routes
```typescript
const LoggingRoute = (options) => Route({
  ...options,
  afterMount: async () => {
    console.log('Route mounted:', options.name);
    if (options.afterMount) await options.afterMount();
  },
});
```

---

## Related Packages & Ecosystem
- [React-Routetouille](../react-routetouille) — Official React bindings
- [Examples](../../examples/react) — Example React app

---

## Contributing

We welcome contributions! Please:
- Follow the [Development Guidelines](../../DEVELOPMENT_GUIDELINES.md)
- Use Biome for linting and formatting (`npm run lint`, `npm run format`)
- Write and colocate tests with Vitest (`*.test.ts`, `*.test.tsx`)
- Write clear, focused commit messages
- See [CONTRIBUTING.md](../../CONTRIBUTING.md) if available

---

## License

MIT
