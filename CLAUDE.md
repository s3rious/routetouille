# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Level (Turbo monorepo)
- `npm run format` - Format all packages using Biome
- `npm run lint` - Lint all packages using Biome 
- `npm run test` - Run tests for all packages
- `npm run typecheck` - Run TypeScript type checking
- `npm run build` - Build all packages
- `npm run publish` - Publish all packages

### Package Level
Commands can be run in either `/packages/routetouille` or `/packages/react-routetouille`:
- `npm run format` - Format using Biome
- `npm run lint` - Lint using Biome (with --write flag)
- `npm run test` - Run Vitest tests
- `npm run test:coverage` - Run tests with coverage
- `npm run build` - TypeScript compilation to `lib/` directory
- `npm run publish` - Publish to npm with public access

### Testing
- Tests are colocated with source files as `*.test.ts` or `*.test.tsx`
- Uses Vitest testing framework
- React tests use `@testing-library/react`
- Coverage reports generated in `coverage/` directory
- **Wallaby.js**: Live testing across all packages and examples (`wallaby.config.js`)

## Architecture Overview

### Core Design Pattern
Routetouille uses a functional composition pattern where both `Router` and `Route` are built by composing multiple "mixin" functions. Each mixin adds specific functionality while maintaining TypeScript type safety through intersection types.

### Router Composition
The Router is composed of nested mixins:
```typescript
Router = Subscribable(WithHistory(WithGoTo(WithUrlTo(WithSet(WithParams(WithPathname(WithActive(WithMap(WithRoot())))))))))
```

Key capabilities:
- **WithRoot**: Manages root route configuration
- **WithMap**: Builds flattened route map with hierarchical keys (e.g., "home.about.contact")
- **WithActive**: Core navigation logic with mount/unmount lifecycle
- **WithHistory**: Browser history integration
- **Subscribable**: Event emission for beforeActivate/afterActivate hooks

### Route Composition
Routes are composed of lifecycle and behavior mixins:
```typescript
Route = WithChildren(WithAfterUnmount(WithAfterMount(WithBeforeUnmount(WithBeforeMount(Redirectable(Mountable(WithPath(WithName()))))))))
```

### Lifecycle System
**Route Lifecycle**: beforeMount → mount → afterMount → beforeUnmount → unmount → afterUnmount
**Router Events**: beforeActivate and afterActivate events during route transitions

### Route Resolution
- Routes stored in flat Map with dot-notation keys maintaining parent-child relationships
- Navigation resolves target routes using fallback logic
- Determines mount/unmount sequence by comparing current vs. target active routes

## Package Structure

### `/packages/routetouille` - Core Router
- Framework-agnostic routing library
- Lifecycle-driven with async hook support
- Composable mixin-based architecture
- Uses `nanoevents` for event handling
- **[See detailed documentation](packages/routetouille/CLAUDE.md)**

### `/packages/react-routetouille` - React Bindings
- React-specific components and hooks
- Context provider for router instance
- Multiple rendering strategies (tree, recursive, exclusive)
- Peer dependency on core `routetouille` package
- **[See detailed documentation](packages/react-routetouille/CLAUDE.md)**

### `/examples`
- `/react` - React example application with Redux integration
  - **[See detailed documentation](examples/react/CLAUDE.md)**
- `/react-complex-app` - Complex React application example with domain-driven design
  - **[See detailed documentation](examples/react-complex-app/CLAUDE.md)**
- `/no-framework` - Vanilla JavaScript example
  - **[See detailed documentation](examples/no-framework/CLAUDE.md)**

## Key Files to Understand

### Core Router
- `packages/routetouille/src/Router/Router.ts` - Main router implementation
- `packages/routetouille/src/Route/Route.ts` - Route implementation
- `packages/routetouille/src/Router/WithActive/WithActive.ts` - Navigation logic
- `packages/routetouille/src/Router/WithMap/WithMap.ts` - Route mapping

### React Bindings
- `packages/react-routetouille/src/Context/Context.ts` - React context
- `packages/react-routetouille/src/hooks/` - React hooks
- `packages/react-routetouille/src/strategies/` - Rendering strategies

## Development Guidelines

- Uses Biome for formatting and linting (configured in `biome.json`)
- TypeScript with strict type checking
- Node.js >= 23.0.0 required
- ES modules only (`"type": "module"` in package.json)
- Vitest for testing with colocated test files
- Turbo for monorepo task orchestration

## Commit Guidelines

- NEVER add Co-Authored-By lines to commits
- Use clear, descriptive commit messages following project conventions

## Package-Specific Documentation

Each package and example has its own detailed CLAUDE.md file:

- **[Core Router Package](packages/routetouille/CLAUDE.md)** - Detailed mixin architecture, testing patterns, and extension guidelines
- **[React Bindings Package](packages/react-routetouille/CLAUDE.md)** - React hooks, components, rendering strategies, and integration patterns
- **[React Example](examples/react/CLAUDE.md)** - HOC composition, Redux integration, and development workflow
- **[React Complex App](examples/react-complex-app/CLAUDE.md)** - Domain-driven design, Effector state management, and production patterns
- **[No-Framework Example](examples/no-framework/CLAUDE.md)** - Vanilla JavaScript usage, DOM manipulation, and build process