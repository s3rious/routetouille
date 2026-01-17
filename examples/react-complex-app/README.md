# React Complex App Example

This is a complex, production-grade example application demonstrating advanced usage of [Routetouille](https://github.com/s3rious/routetouille) and [react-routetouille](https://github.com/s3rious/routetouille/tree/master/packages/react-routetouille) in a real-world React environment. It features modular domain-driven architecture, state management with Effector, a mock API, and a full authentication flow.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [What to Look At](#what-to-look-at)
- [Architecture Overview](#architecture-overview)
- [Example Features](#example-features)
- [How to Launch](#how-to-launch)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Start the Mock API](#2-start-the-mock-api)
  - [3. Start the App](#3-start-the-app)
  - [4. Run Tests](#4-run-tests)
  - [5. Lint & Format](#5-lint--format)
- [Tech Stack](#tech-stack)
- [Browser Support](#browser-support)
- [Editor & Code Style](#editor--code-style)
- [File Structure](#file-structure)
- [Tips](#tips)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## What to Look At

- Domain-Driven Structure: Each feature (auth, posts, dashboard, etc.) is isolated in its own domain folder, with clear separation of UI, state, and routing logic.
- Advanced Routing: Deeply nested, dynamic, and guarded routes using Routetouille's modular API.
- Effector State Management: All state (auth, posts, UI) is managed with Effector stores and effects, including async flows and localStorage persistence.
- Mock API: A local Express server (`mock-api.js`) provides realistic endpoints for posts and authentication, enabling full offline development.
- UI Architecture: Atomic design (atoms, molecules), reusable layouts, skeleton loaders, and a design token system via CSS variables.
- Testing & Tooling: Includes Vitest for unit tests, Biome for linting/formatting, and Palettier for design token generation.

---

## Architecture Overview

```
src/
  components/                # Atomic UI building blocks (atoms, molecules)
  domains/                   # Feature modules (auth, posts, dashboard, etc.)
    client/                  # Authenticated/unauthenticated flows, user state
    posts/                   # Posts list, post details, post models
    dashboard/               # Dashboard page, hooks, and store
    root/                    # App shell, layout, and global UI state
    fallback/                # 404 and error handling
    login/, logout/, signUp/ # Auth flows
  services/                  # Shared services (API, router, model utilities)
index.ts                     # App entry, router tree composition
```

- Routing: Composed in `src/index.ts` using Routetouille's modular API. Each domain exports a `getRoute` function for tree composition.
- State: Effector stores and effects per domain, with localStorage persistence for auth.
- UI: Follows atomic design, with global styles and palette tokens.

---

## Example Features

- Authentication: Sign up, log in, log out, and protected routes. Only `@example.com` emails can register (see `client/store/api.ts`).
- Posts: Fetches a large list of posts from the mock API, with skeleton loading, post details, and dashboard summary.
- Dashboard: Shows latest posts, links to full post list, and uses nested routing.
- 404 Fallback: Custom 404 page for unknown routes.
- Optimistic Routing: Uses Routetouille's `optimistic` mode for instant navigation feedback.
- Effector Logger: Enabled in development for debugging state changes.

---

## How to Launch

### 1. Install Dependencies

```sh
npm install
```

### 2. Start the Mock API

```sh
npm run mock-api
# Runs on http://localhost:4000
```

### 3. Start the App

```sh
npm run dev:all
```

### 4. Run Tests

```sh
npm test
```

### 5. Lint & Format

```sh
npm run lint
npm run format
```

---

## Tech Stack

- React 19
- Effector (state management)
- Routetouille (routing)
- Vitest (testing)
- Biome (linting/formatting)
- Vite (build/dev server)
- Palettier (design tokens)
- Express (mock API)

---

## Browser Support

See `.browserslistrc` for supported browsers (modern, no IE11).

---

## Editor & Code Style

- Enforced by `.editorconfig` and `biome.json`
- 2-space indentation, LF line endings, UTF-8
- CSS Modules and design tokens for consistent theming

---

## File Structure

- `src/components/atoms/` — Buttons, Inputs, Layout, etc.
- `src/components/molecules/` — Header, Footer, Toast, etc.
- `src/domains/` — Feature modules (auth, posts, dashboard, etc.)
- `src/services/` — API, router, model utilities
- `mock-api.js` — Local Express server for API endpoints

---

## Tips

- Authentication: Only emails ending with `@example.com` can sign up.
- Mock Data: Posts and user data are randomly generated for demo purposes.
- Effector Logger: State changes are logged in development mode.
- Design Tokens: Run `npm run palettier` to regenerate palette CSS from tokens.

---

## License

MIT 