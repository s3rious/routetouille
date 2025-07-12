# Development Guidelines

These guidelines are derived strictly from the actual conventions and practices in the `routetouille` and `react-routetouille` packages. Follow these to ensure consistency and maintainability.

---

## 1. Formatting & Linting
- Use [Biome](https://biomejs.dev/) for all linting and formatting (`npm run lint`, `npm run format`).
- `.editorconfig` enforces:
  - 2 spaces for indentation
  - UTF-8 charset
  - LF line endings
  - Trims trailing whitespace (except in markdown)
  - Inserts final newline

## 2. TypeScript
- All code is TypeScript (`.ts`/`.tsx`).
- `tsconfig.json` uses `"strict": true` and targets modern ECMAScript (`ES2024`).
- No use of `any`; use explicit types or `unknown`.
- Types and interfaces use PascalCase.
- All code is in `src/`, output is in `lib/`.
- Test files (`*.test.ts`, `*.test.tsx`) are excluded from build output.

## 3. File & Directory Structure
- Each package has a `src/` directory, organized by feature (e.g., `Route/`, `Router/`, `hooks/`, `strategies/`).
- Test files are colocated with the code they test and named `*.test.ts` or `*.test.tsx`.
- Use `index.ts` for re-exports in each folder.

## 4. Naming Conventions
- Files and folders: PascalCase or camelCase (e.g., `WithName`, `useRouter.ts`).
- Types/interfaces: PascalCase.
- Constants: UPPER_CASE.
- Route names (in code): kebab-case (e.g., `'sign-up'`).
- React hooks: `use` prefix (e.g., `useRouter`).
- Components/HOCs: PascalCase.

## 5. Exports
- All exports are gathered in `index.ts` files.
- No inline exports; export at the bottom or via `index.ts`.

## 6. Immutability & Logic
- Use `const` by default; prefer immutability.
- Functions are small, focused, and composable.
- No magic numbers/strings; use named constants.

## 7. Testing
- Use `vitest` for all tests.
- Tests are colocated and named `*.test.ts` or `*.test.tsx`.
- Run tests with `npm run test` and coverage with `npm run test:coverage`.

## 8. Comments & Documentation
- No comments about code history or changes.
- No unnecessary comments; code should be self-explanatory.
- Use JSDoc/TSDoc for exported functions and types.