# CLAUDE.md - No-Framework Example

This file provides guidance for working with the no-framework example at `/examples/no-framework/`.

## Overview

This example demonstrates how to use Routetouille in a pure vanilla JavaScript environment without any UI frameworks. It showcases framework-agnostic routing with minimal dependencies and direct DOM manipulation.

## Development Commands

- `npm run build` - Bundle src/index.js into dist/bundle.js using esbuild
- `npm run serve` - Serve the application using http-server with cache disabled
- `npm run dev` - Build and serve in one command

## Project Structure

```
examples/no-framework/
├── README.md          # Comprehensive documentation
├── package.json       # Minimal dependencies (only Routetouille)
├── index.html         # Basic HTML shell
├── src/
│   └── index.js       # Core router implementation
└── dist/
    └── bundle.js      # Built output (IIFE format)
```

## Key Implementation Patterns

### Router Configuration (`src/index.js`)

```javascript
import { Router, Route, FallbackRoute, BrowserHistory } from 'routetouille';

const router = Router({
  history: BrowserHistory()
});

router.root = Route({
  name: "main",
  path: "/",
  afterMount: () => {
    document.getElementById("root").innerHTML = `
      <h1>Routetouille No-Framework Example</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/foo/">Foo</a>
        <a href="/bar/">Bar</a>
      </nav>
      <p>This is the main page content.</p>
    `;
  },
  children: [
    Route({
      name: "foo",
      path: "foo/",
      afterMount: () => {
        document.getElementById("root").innerHTML = `
          <h1>Foo Page</h1>
          <p>This is the Foo page content.</p>
          <a href="/">Back to Home</a>
        `;
      }
    }),
    Route({
      name: "bar", 
      path: "bar/",
      afterMount: () => {
        document.getElementById("root").innerHTML = `
          <h1>Bar Page</h1>
          <p>This is the Bar page content.</p>
          <a href="/">Back to Home</a>
        `;
      }
    }),
    FallbackRoute({
      name: "404",
      afterMount: () => {
        document.getElementById("root").innerHTML = `
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/">Go back to Home</a>
        `;
      }
    })
  ]
});

router.init();
```

### HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Routetouille No-Framework Example</title>
</head>
<body>
  <div id="root"></div>
  <script src="dist/bundle.js"></script>
</body>
</html>
```

## Core Concepts Demonstrated

### 1. Framework-Agnostic Architecture
- **No UI library dependencies**: Pure JavaScript implementation
- **Minimal abstraction**: Direct DOM manipulation without virtual DOM
- **Standard web APIs**: Relies on native browser capabilities

### 2. SPA Navigation
- **History API integration**: Uses `BrowserHistory()` for proper URL handling
- **Seamless navigation**: No page reloads during route changes
- **Bookmarkable URLs**: Proper URL structure for direct navigation

### 3. Lifecycle Management
- **afterMount hooks**: Routes define what happens when they become active
- **Clean separation**: Routing logic separated from rendering logic
- **Predictable behavior**: Clear lifecycle for route activation

### 4. DOM Manipulation Strategy
- **Direct innerHTML manipulation**: All rendering done by setting `innerHTML` on root element
- **Imperative approach**: Routes directly manipulate DOM in their `afterMount` hooks
- **Simple templating**: HTML written as template literals within JavaScript

## Route Definition Pattern

Each route follows a consistent structure:

```javascript
Route({
  name: "routeName",        // Unique identifier
  path: "path/",           // URL path pattern
  afterMount: () => {      // DOM manipulation when route becomes active
    document.getElementById("root").innerHTML = `<!-- HTML content -->`;
  }
})
```

## Nested Routing

```javascript
router.root = Route({
  name: "main",
  path: "/",
  afterMount: () => { /* main content */ },
  children: [
    Route({ name: "foo", path: "foo/", afterMount: () => { /* foo content */ } }),
    Route({ name: "bar", path: "bar/", afterMount: () => { /* bar content */ } }),
    FallbackRoute({ name: "404", afterMount: () => { /* 404 content */ } })
  ]
});
```

**Key Features:**
- **Hierarchical structure**: Routes nested under `router.root`
- **Child routes**: Foo and Bar routes are children of the main route
- **Path inheritance**: Child paths are relative to parent paths
- **Fallback handling**: `FallbackRoute` handles unknown paths

## Navigation Patterns

### Standard HTML Links
```html
<nav>
  <a href="/">Home</a>
  <a href="/foo/">Foo</a>
  <a href="/bar/">Bar</a>
</nav>
```

**Benefits:**
- **No JavaScript required**: Standard anchor tags work seamlessly
- **SEO friendly**: Proper href attributes for search engines
- **Accessibility**: Screen readers understand standard navigation
- **Progressive enhancement**: Works even if JavaScript fails

### 404 Handling
```javascript
FallbackRoute({
  name: "404",
  afterMount: () => {
    document.getElementById("root").innerHTML = `
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Go back to Home</a>
    `;
  }
})
```

## Build Process

### esbuild Configuration
```javascript
// Implicit configuration in package.json
{
  "scripts": {
    "build": "esbuild src/index.js --bundle --outfile=dist/bundle.js --format=iife --global-name=RoutetouilleExample"
  }
}
```

**Build Features:**
- **Bundle creation**: Processes `src/index.js` and creates `dist/bundle.js`
- **IIFE format**: Output wrapped as Immediately Invoked Function Expression
- **Global name**: Bundle assigned to `RoutetouilleExample` global variable
- **Fast bundling**: esbuild provides extremely fast build times

### Development Server
```javascript
{
  "scripts": {
    "serve": "http-server -c-1 -P http://localhost:8080"
  }
}
```

**Server Features:**
- **Static serving**: Uses http-server to serve files
- **Cache disabled**: `-c-1` flag prevents caching during development
- **Fallback handling**: `-P` flag provides proper SPA fallback support

## Key Takeaways for Vanilla JS Implementation

### Essential Patterns
1. **Router initialization**: Create router with history, define routes, call `init()`
2. **Route rendering**: Use `afterMount` hooks for DOM manipulation
3. **Navigation**: Standard HTML links work seamlessly with Routetouille
4. **Error handling**: Use `FallbackRoute` for 404 scenarios

### Best Practices Demonstrated
- **Single responsibility**: Each route handles only its own rendering
- **Consistent structure**: All routes follow the same pattern
- **Simple templating**: Template literals provide clean HTML generation
- **Minimal dependencies**: Only include what's absolutely necessary

### Development Benefits
- **Fast iteration**: Simple build process with esbuild
- **Easy debugging**: All logic in a single file for transparency
- **No framework overhead**: Direct control over DOM and performance
- **Small bundle size**: Minimal dependencies keep bundle size low

## Dependencies

### Runtime Dependencies
- `routetouille` - Core router (local package dependency)

### Development Dependencies
- `esbuild` - Fast JavaScript bundler
- `http-server` - Static file server for development

## Use Cases

This example is ideal for:
- **Learning Routetouille**: Understanding core concepts without framework complexity
- **Prototyping**: Quick demos and proof-of-concepts
- **Legacy integration**: Adding routing to existing vanilla JS applications
- **Performance-critical applications**: Minimal overhead for maximum performance
- **Progressive enhancement**: Adding SPA features to traditional websites

## Extending the Example

### Adding New Routes
```javascript
Route({
  name: "new-route",
  path: "new-path/",
  afterMount: () => {
    document.getElementById("root").innerHTML = `
      <h1>New Route</h1>
      <p>Your content here</p>
    `;
  }
})
```

### Adding Route Parameters
```javascript
Route({
  name: "user-profile",
  path: "user/:userId/",
  afterMount: (route) => {
    const userId = route.params.userId;
    document.getElementById("root").innerHTML = `
      <h1>User Profile: ${userId}</h1>
    `;
  }
})
```

### Adding Lifecycle Hooks
```javascript
Route({
  name: "protected",
  path: "protected/",
  beforeMount: async () => {
    // Authentication check
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      router.goTo('/login/');
    }
  },
  afterMount: () => {
    // Render content
  }
})
```

This example provides a solid foundation for understanding Routetouille's capabilities and can be extended for more complex vanilla JavaScript applications.