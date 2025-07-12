<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Routetouille Monorepo](#routetouille-monorepo)
  - [What is "Routetouille"?](#what-is-routetouille)
  - [Vision & Philosophy](#vision--philosophy)
  - [Monorepo Structure](#monorepo-structure)
  - [Packages](#packages)
    - [routetouille](#routetouille)
      - [Quickstart](#quickstart)
    - [react-routetouille](#react-routetouille)
      - [Quickstart](#quickstart-1)
  - [Examples](#examples)
  - [Development & Contribution](#development--contribution)
  - [Community & Support](#community--support)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Routetouille Monorepo

> **A modern, extensible, and lifecycle-driven routing ecosystem for JavaScript and TypeScript.**

---

## What is "Routetouille"?

**Routetouille** is a playful blend of "route" and "ratatouille"—just as ratatouille is a dish made from diverse, harmonious ingredients, Routetouille is a router designed to be composed, extended, and enjoyed in many flavors. It brings together the best ingredients of modern routing: lifecycle, extensibility, and framework-agnostic design.

---

## Vision & Philosophy

Routetouille is a next-generation routing platform for ambitious web applications and libraries. It is:
- **Lifecycle-first**: Every route has hooks for data loading, analytics, and cleanup.
- **Hackable & Extensible**: Compose, override, or extend any behavior. Build your own route types, history strategies, or integrations.
- **Framework-agnostic**: Use with React, Vue, Svelte, or vanilla JS. The core is UI-agnostic.
- **Isomorphic**: Works in browsers, SSR, and custom environments. Swap out history providers as needed.
- **Type-safe**: Built for modern TypeScript and JavaScript, with strict types and composable APIs.

---

## Monorepo Structure

This repository contains all official Routetouille packages and examples:

```
/packages
  /routetouille         # Core router (framework-agnostic, lifecycle-driven)
  /react-routetouille   # Official React bindings (idiomatic hooks, context, components)
/examples
  /react                # Example React app using Routetouille
```

- Each package is self-contained, with its own source, tests, and documentation.
- All code is TypeScript, formatted and linted with Biome.

---

## Packages

### [routetouille](./packages/routetouille)
- **Core, framework-agnostic router**
- Lifecycle hooks for routes: `beforeMount`, `afterMount`, `beforeUnmount`, `afterUnmount`
- Composable API: build route trees, extend or override behaviors
- Isomorphic history: works with browser, memory, or custom providers
- Use in any JS/TS project, or as a base for your own bindings

#### Quickstart
```sh
npm install routetouille
```
```typescript
import { Router, Route, FallbackRoute, BrowserHistory } from 'routetouille';
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
router.init();
```
- See [detailed API and advanced usage](./packages/routetouille/README.md)

---

### [react-routetouille](./packages/react-routetouille)
- **Official React bindings**
- Idiomatic hooks (`useRoute`, `useGoTo`, etc.), context, and components
- Full TypeScript support, SSR/CSR ready
- Compose with React state, context, or data-fetching libraries

#### Quickstart
```sh
npm install routetouille react-routetouille
```
```tsx
import { RoutetouilleProvider, useRoute, useGoTo } from 'react-routetouille';
<RoutetouilleProvider router={router}>
  <MainView />
</RoutetouilleProvider>
```
- See [API reference and advanced integration](./packages/react-routetouille/README.md)

---

## Examples

- [No-Framework Example](./examples/no-framework) — Minimal vanilla JS usage as an npm package. Demonstrates Routetouille routing and DOM manipulation without any frontend framework.
- [React Example App](./examples/react) — See Routetouille in action with React, including route trees, navigation, and lifecycle hooks.

---

## Development & Contribution

We welcome contributions! To keep the codebase consistent and maintainable:
- Follow the [Development Guidelines](./DEVELOPMENT_GUIDELINES.md) (strictly based on actual codebase conventions)
- Use Biome for linting and formatting (`npm run lint`, `npm run format`)
- Write and colocate tests with Vitest (`*.test.ts`, `*.test.tsx`)
- Use clear, focused commit messages
- See [CONTRIBUTING.md](./CONTRIBUTING.md) if available

---

## Community & Support

- [GitHub Issues](https://github.com/your-org/routetouille/issues) — Bug reports & feature requests
- [Discussions](https://github.com/your-org/routetouille/discussions) — Q&A, ideas, and help

---

## License

MIT 