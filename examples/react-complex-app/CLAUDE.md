# CLAUDE.md - React Complex App Example

This file provides guidance for working with the complex React application example at `/examples/react-complex-app/`.

## Overview

This example demonstrates a sophisticated, production-ready React application that showcases advanced usage of Routetouille for complex routing scenarios. It features domain-driven design, enterprise-level state management, and comprehensive development practices.

## Development Commands

- `npm run dev` - Start Vite development server  
- `npm run dev:api` - Start mock API server on port 3001
- `npm run dev:all` - Start both app and API servers concurrently
- `npm run build` - Build for production
- `npm run lint` - Lint with Biome
- `npm run format` - Format code with Biome  
- `npm run test` - Run Vitest tests
- `npm run palettier` - Generate CSS design tokens

## Architecture Overview

### Domain-Driven Design Structure

```
src/
├── components/           # Atomic UI components
│   ├── atoms/           # Basic UI primitives (Button, Input, Layout)
│   └── molecules/       # Composite UI components (Header, Footer, Toast)
├── domains/             # Feature-based modules
│   ├── client/          # Authentication state and user management
│   ├── posts/           # Posts management with list/detail views
│   ├── dashboard/       # Dashboard functionality
│   ├── root/            # Application shell
│   ├── login/           # Login flow
│   ├── logout/          # Logout flow
│   ├── signUp/          # Registration flow
│   └── fallback/        # 404 handling
├── services/            # Shared utilities
│   ├── api/            # API abstraction layer
│   ├── router/         # Router services and helpers
│   └── model/          # Data models and validators
└── index.ts            # Application entry point
```

### Domain Structure Pattern

Each domain follows a consistent structure:
```
domains/example/
├── components/          # Domain-specific components
├── hooks/              # Custom React hooks
├── store/              # Effector state management
│   ├── api.ts          # API effects
│   ├── effects.ts      # Business logic effects
│   ├── index.ts        # Public exports
│   └── model/          # Data models
└── index.ts            # Route configuration
```

## Complex Routing Patterns

### Router Tree Composition (`src/index.ts`)

```typescript
router.root = getRootRoute(router, [
  getClientRoute(router, [
    getLogOutRoute(router),
    getNonAuthRoute(router, [
      getLoginRoute(router), 
      getSignUpRoute(router)
    ]),
    getAuthRoute(router, [
      getPostsRoute(router, [
        getDashboardRoute(router, [
          getPostsListRoute(router, [
            getPostRoute(router)
          ]),
        ]),
      ]),
    ]),
  ]),
  getFallbackRoute(router),
]);
```

### Advanced Routing Features

#### Authentication Guards
```typescript
// domains/client/domains/auth/index.ts
redirects: [
  redirect(
    router,
    async () => {
      const accessToken = $accessToken.getState();
      return !accessToken;
    },
    "non-auth",
  ),
],
```

#### Route Composition Function Pattern
```typescript
export function getExampleRoute(
  router: RouterInterface,
  children: RouteInterface[] = [],
): RouteInterface {
  return WithReactComponent(Route)({
    name: "example",
    path: "example/",
    component: ExampleComponent,
    children,
  });
}
```

#### Modular Route Building
- **Composable Routes**: Each domain exports a `getRoute` function
- **Nested Dependencies**: Routes can compose other routes as children
- **Type Safety**: Full TypeScript support for route composition
- **Reusable Patterns**: Consistent route building across domains

## State Management with Effector

### Core Architecture

#### Stores
```typescript
const $client = createStore(new ClientModel({}), { name: "client/$client" })
  .on(effects.fetchClient.doneData, (state, client) => 
    new ClientModel({ ...state, ...client })
  )
  .on(effects.signUp.doneData, (state, response) => {
    if (response instanceof Error) return state;
    return new ClientModel({ ...state, ...response });
  })
  .reset(effects.logOut.done);
```

#### Effects
```typescript
const fetchClient = createEffect(async ({ accessToken }: { accessToken: string }) => {
  const response = await fetch(`${API_URL}/client`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
});
```

#### Events
```typescript
const updateClient = createEvent<Partial<ClientModel>>();
const logOut = createEvent();
```

### State Management Features

- **Persistence**: localStorage integration with effector-storage
- **Type Safety**: Strong typing with TypeScript models
- **Error Handling**: Proper error state management
- **Loading States**: Combined loading indicators
- **Domain Isolation**: Each domain manages its own state
- **Reactive Updates**: Automatic UI updates on state changes

## Component Architecture

### Atomic Design System

#### Atoms (`src/components/atoms/`)
- **Button**: Themeable button with multiple variants
- **Input**: Form input with validation states
- **Layout**: Responsive layout containers
- **Typography**: Consistent text styling
- **Spacing**: Standardized spacing components

#### Molecules (`src/components/molecules/`)
- **Header**: Navigation header with authentication state
- **Footer**: Application footer
- **Toast**: Notification system
- **RegularButton**: Composed button with standard styling

### Component Features

- **CSS Modules**: Scoped styling with design tokens
- **TypeScript**: Full type safety with proper interfaces
- **Composition**: Flexible component composition patterns
- **Accessibility**: Semantic HTML and proper labeling

### Example Component (`src/components/atoms/Button/Button.tsx`)
```typescript
type ButtonProps = {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  theme?: ButtonTheme;
  disabled?: boolean;
  block?: boolean;
} & HTMLProps<HTMLButtonElement>;

function Button({ 
  children, 
  className, 
  type = "button", 
  theme = "primary",
  disabled = false,
  block = false,
  ...props 
}: ButtonProps) {
  const buttonClass = classnames(
    styles.button,
    styles[theme],
    { [styles.block]: block },
    className
  );

  return (
    <button 
      className={buttonClass}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Design Token System

### Palettier Integration

Design tokens are generated from `/src/components/atoms/Palette/tokens/` and compiled into CSS variables:

```javascript
// tokens/color/primary.js
export const primary = {
  50: "#f0f9ff",
  100: "#e0f2fe", 
  500: "#0ea5e9",
  900: "#0c4a6e"
};
```

Generated CSS:
```css
:root {
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #0ea5e9;
  --color-primary-900: #0c4a6e;
}
```

### Token Categories
- **Color**: Primary, secondary, status, typography, background
- **Animation**: Speed, transition timing
- **Shadow**: Elevation levels
- **Z-index**: Layer management

## Testing Strategy

### Test Organization
- **Unit Tests**: Model validation and business logic
- **Integration Tests**: Effect and store interactions
- **Component Tests**: React component behavior
- **API Tests**: Mock API integration

### Example Test (`src/domains/client/store/effects.test.ts`)
```typescript
describe("effects", () => {
  it("fetchClient updates $client", async () => {
    const scope = fork();
    await allSettled(fetchClient, { 
      scope, 
      params: { accessToken: "token" } 
    });
    
    expect(scope.getState($client)).toEqual(new ClientModel({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    }));
  });
});
```

### Testing Patterns
- **Effector Testing**: Using `fork()` and `allSettled()` for isolated tests
- **Mock API**: JSON-based mock responses
- **Type Safety**: Full TypeScript support in tests
- **Domain Isolation**: Tests organized by domain

## Mock API Server

### Setup (`mock-api.js`)
```javascript
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post("/api/auth/login", (req, res) => {
  // Mock authentication logic
});

// Posts endpoints
app.get("/api/posts", (req, res) => {
  // Mock posts data
});
```

### Features
- **Express Server**: Local development API on port 3001
- **CORS Enabled**: Frontend-backend communication
- **Lorem Ipsum**: Realistic dummy content
- **Authentication**: Mock login/logout flows
- **CRUD Operations**: Full API simulation

## Configuration Files

### Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      services: resolve(__dirname, "src/services"),
      domains: resolve(__dirname, "src/domains"),
      components: resolve(__dirname, "src/components"),
    },
  },
});
```

### TypeScript Configuration (`tsconfig.json`)
- **Strict Mode**: Enforces type safety
- **Modern Targets**: ES2022, NodeNext modules
- **Path Aliases**: Clean imports with baseUrl

### Biome Configuration (`biome.json`)
- **Linting**: Recommended rules with import extensions
- **Formatting**: 2-space indentation, import organization
- **CSS Modules**: Support for CSS Module syntax

## Key Architectural Decisions

### 1. Domain-Driven Design
- **Feature Isolation**: Each domain is self-contained
- **Clear Boundaries**: Defined interfaces between domains
- **Shared Services**: Common utilities in services layer

### 2. Effector State Management
- **Reactive**: Automatic UI updates on state changes
- **Predictable**: Clear data flow and state transitions
- **Testable**: Easy to test with fork/allSettled pattern

### 3. Atomic Design System
- **Scalable**: Component hierarchy supports growth
- **Consistent**: Design tokens ensure visual consistency
- **Reusable**: Components can be composed flexibly

### 4. TypeScript-First Approach
- **Type Safety**: Comprehensive type coverage
- **Developer Experience**: Excellent IDE support
- **Maintainability**: Easier refactoring and debugging

## Production-Ready Features

1. **Scalable Architecture**: Domain-driven design supports team development
2. **Type Safety**: Comprehensive TypeScript coverage
3. **Testing Strategy**: Unit and integration tests with mocking
4. **Development Experience**: Hot reloading, linting, formatting
5. **Performance**: Optimistic routing, loading states, skeleton screens
6. **Accessibility**: Semantic HTML, proper form handling
7. **Maintainability**: Clear separation of concerns, consistent patterns
8. **Design System**: Atomic components with design tokens
9. **Error Handling**: Proper error boundaries and state management
10. **Authentication**: Complete auth flow with persistence

## Comparison with Simple React Example

| Aspect | Simple Example | Complex Example |
|--------|---------------|-----------------|
| **Structure** | Flat components | Domain-driven architecture |
| **State** | Redux with actions | Effector with effects/models |
| **Routing** | Basic nested routes | Complex guarded routes |
| **Styling** | Basic CSS | CSS Modules + design tokens |
| **Testing** | Minimal | Comprehensive unit/integration |
| **API** | No backend | Full mock API server |
| **Auth** | Simple guard | Complete auth flow |
| **Components** | Basic components | Atomic design system |
| **Build** | Standard Vite | Enhanced with token generation |

## Best Practices Demonstrated

1. **Domain Separation**: Clear boundaries between features
2. **Composition Patterns**: Flexible route and component composition
3. **Type Safety**: Comprehensive TypeScript usage
4. **Testing**: Isolated, predictable test patterns
5. **Performance**: Optimistic navigation and loading states
6. **Maintainability**: Consistent patterns across domains
7. **Developer Experience**: Excellent tooling and workflow
8. **Scalability**: Architecture that grows with team size

This complex example provides a comprehensive template for building production-ready React applications with Routetouille, demonstrating enterprise-level patterns and practices.