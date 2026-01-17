# No-Framework Example

This is a minimal, framework-agnostic example demonstrating the core usage of [Routetouille](https://github.com/s3rious/routetouille) in a pure JavaScript environment. It showcases basic client-side routing, navigation, and 404 handling without any UI library or build complexity.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [What to Look At](#what-to-look-at)
- [Architecture Overview](#architecture-overview)
- [Example Features](#example-features)
- [How to Launch](#how-to-launch)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Build the Bundle](#2-build-the-bundle)
  - [3. Serve the App](#3-serve-the-app)
- [Tech Stack](#tech-stack)
- [Browser Support](#browser-support)
- [Editor & Code Style](#editor--code-style)
- [File Structure](#file-structure)
- [Tips](#tips)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## What to Look At

- **Zero Framework**: No React, Vue, or other UI libraries—just vanilla JS and Routetouille.
- **Simple Routing**: Demonstrates nested routes, navigation, and a custom 404 fallback.
- **Single File Logic**: All routing and rendering logic is in `src/index.js` for maximum clarity.
- **Instant Navigation**: Uses Routetouille's browser history integration for SPA-like navigation.

---

## Architecture Overview

```
no-framework/
  index.html           # Minimal HTML shell
  src/
    index.js           # All routing and rendering logic
  dist/
    bundle.js          # Output bundle (generated)
  package.json         # Scripts and dependencies
```

- **Routing**: Defined in `src/index.js` using Routetouille's modular API.
- **Rendering**: Direct DOM manipulation in route hooks (`afterMount`).
- **404 Handling**: Custom fallback route for unknown paths.

---

## Example Features

- **Main Page**: Root route with links to Foo and Bar pages.
- **Nested Routes**: `/foo/` and `/bar/` each render their own content.
- **404 Fallback**: Any unknown route displays a custom 404 message.
- **SPA Navigation**: Uses browser history for seamless navigation without reloads.

---

## How to Launch

### 1. Install Dependencies

```sh
npm install
```

### 2. Build the Bundle

```sh
npm run build
# Outputs to dist/bundle.js
```

### 3. Serve the App

```sh
npm run serve
# Opens at http://localhost:8080
```

---

## Tech Stack

- Vanilla JavaScript (ES2020+)
- [Routetouille](https://github.com/s3rious/routetouille) (routing)
- [esbuild](https://esbuild.github.io/) (bundler)
- [http-server](https://www.npmjs.com/package/http-server) (static server)

---

## Browser Support

Modern browsers (see Routetouille requirements). No polyfills included.

---

## Editor & Code Style

- 2-space indentation, LF line endings, UTF-8
- All logic in a single file for easy reading
- Output bundle and `dist/` are git-ignored

---

## File Structure

- `index.html` — Minimal HTML shell with a root div and script tag
- `src/index.js` — Routing and rendering logic
- `dist/bundle.js` — Generated bundle (after build)
- `package.json` — Scripts and dependencies

---

## Tips

- Edit `src/index.js` to add or change routes.
- The 404 fallback is handled by Routetouille's `FallbackRoute`.
- No frameworks, no dependencies except Routetouille and build tools.

---

## License

MIT 