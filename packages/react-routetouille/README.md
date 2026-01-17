# React-Routetouille

> **Official React bindings for Routetouille: type-safe, idiomatic, and fully lifecycle-aware.**

---

## What is "Routetouille"?

**Routetouille** is a blend of "route" and "ratatouille"—just as ratatouille is a dish made from diverse, harmonious ingredients, Routetouille is a router designed to be composed, extended, and enjoyed in many flavors. The React bindings bring this philosophy to React apps, providing idiomatic hooks, context, and components.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Introduction](#introduction)
- [Why use React-Routetouille?](#why-use-react-routetouille)
- [Quickstart](#quickstart)
  - [Installation](#installation)
  - [Minimal Example](#minimal-example)
- [API Reference](#api-reference)
  - [`<RoutetouilleProvider>`](#routetouilleprovider)
  - [Hooks](#hooks)
  - [Components](#components)
- [Idiomatic Usage](#idiomatic-usage)
- [Advanced Integration](#advanced-integration)
- [Related Resources](#related-resources)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Introduction

React-Routetouille brings the power and flexibility of [Routetouille](../routetouille) to React applications. It provides idiomatic hooks, context, and components for seamless integration with React’s rendering and state model. Use it to:
- Build complex, lifecycle-driven navigation in React
- Share route logic with non-React apps or microfrontends
- Compose with React state, context, or data-fetching libraries

---

## Why use React-Routetouille?

- **Lifecycle-driven routing**: Leverage Routetouille’s advanced route lifecycle in React apps.
- **Type-safe, composable API**: Use hooks and context for full TypeScript support.
- **No framework lock-in**: Share route logic with non-React apps or microfrontends.
- **Extensible**: Compose with custom hooks, providers, or advanced patterns.
- **SSR/CSR ready**: Works in both client and server-rendered React apps.

---

## Quickstart

### Installation

```sh
npm install routetouille react-routetouille
# or
yarn add routetouille react-routetouille
```

### Minimal Example

```tsx
import React from 'react';
import { Router, Route, FallbackRoute, BrowserHistory } from 'routetouille';
import { RoutetouilleProvider, useRoute, useGoTo } from 'react-routetouille';

const router = Router({
  history: BrowserHistory(),
  root: Route({
    name: 'main',
    path: '/',
    children: [
      Route({ name: 'foo', path: 'foo/' }),
      FallbackRoute({ name: '404' }),
    ],
  }),
});

function App() {
  return (
    <RoutetouilleProvider router={router}>
      <MainView />
    </RoutetouilleProvider>
  );
}

function MainView() {
  const { active, params, pathname } = useRoute();
  const goTo = useGoTo();
  return (
    <div>
      <h1>Current route: {active.map(r => r.name).join(' > ')}</h1>
      <button onClick={() => goTo('foo')}>Go to Foo</button>
      <div>Params: {JSON.stringify(params)}</div>
      <div>Pathname: {pathname}</div>
    </div>
  );
}
```

---

## API Reference

### `<RoutetouilleProvider>`
- Wraps your app and provides router context.
- Props:
  - `router`: Routetouille router instance (required).
  - `children`: React nodes.

### Hooks
- **`useRoute()`**: Returns `{ active, params, pathname }` for the current route state.
- **`useGoTo()`**: Returns a function to activate a route by name, path, or array.
- **`useUrlTo()`**: Returns a function to generate URLs for routes and params.
- **`useRouter()`**: Access the underlying router instance.

### Components
- **`<Link to={...} params={...} ... />`**: Declarative navigation (see advanced usage).
- **`<RouteView />`**: Render active route components (if using component-based route trees).

---

## Idiomatic Usage

- Use hooks for navigation and route state in any component.
- Compose Routetouille with React state, context, or data-fetching libraries.
- Use lifecycle hooks in route definitions for data loading, analytics, or cleanup.
- Integrate with SSR by hydrating the router state on the server and client.
- Build custom hooks or HOCs on top of Routetouille’s primitives.

---

## Advanced Integration

- **Custom hooks**: Build your own hooks on top of `useRoute`, `useGoTo`, etc.
- **Nested routers**: Compose multiple routers for microfrontends or complex layouts.
- **SSR/SSG**: Preload data in route hooks and hydrate on the client.
- **TypeScript**: All hooks and components are fully typed.
- **Testing**: Use Vitest and React Testing Library for hooks and component tests.

---

## Related Resources
- [Routetouille Core](../routetouille) — Core router documentation
- [React Complex Example](../../examples/react-complex-app) — Complex, heavy React app example

---

## Contributing

For contribution guidelines, see the [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

---

## License

MIT
