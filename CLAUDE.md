# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Primary reference

[AGENTS.md](AGENTS.md) is the authoritative instruction set for this project: resolver/DTO patterns, security rules, "Ask First" / "Never Do" lists, and code-quality guidelines. Read it before making changes. This file covers the commands and the big-picture architecture that require reading multiple files to grasp.

## Commands

- `npm run dev` — dev server with hot reload (tsx watch, no build step)
- `npm run build` — production build: `tsc` → `tsc-alias` (rewrites `#/*` path aliases in emitted JS) → copies `src/public` to `dist`. Both `tsc-alias` and the copy are required; a plain `tsc` produces a non-runnable build.
- `npm start` — runs the compiled `dist/server.js` (build first)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` / `npm run lint -- --fix`
- `npm test` — run all tests once (Vitest); `npm run test:watch` for watch mode
- Run a single test file: `npx vitest run tests/gql/resolvers/expenses.test.ts`
- Filter by name: `npx vitest run -t "registerExpense"`

Node 24.x is required (see `.nvmrc` / `engines`). Husky runs a pre-commit hook.

## Architecture

**GraphQL API** (Apollo Server 3 on Express) backed by **MongoDB via Mongoose**. Entry point is [src/server.ts](src/server.ts).

**Dependency injection is the core pattern.** Resolvers never import models or validation helpers directly. Instead, [src/gql/auth/setContext.ts](src/gql/auth/setContext.ts) builds a `context.di` object (Mongoose models, JWT, auth/paging/datetime/parameter validations) that every resolver receives as its third argument. To add a capability available to resolvers, wire it into `setContext` and the `Context` interface there. Always type resolver context as `Context` from `setContext.js` — never `any`.

**Schema is stitched from two parallel trees:**
- Type definitions: `src/gql/types/*` aggregated by [src/gql/types/index.ts](src/gql/types/index.ts)
- Resolvers: `src/gql/resolvers/*` combined with `lodash.merge` in [src/gql/resolvers/index.ts](src/gql/resolvers/index.ts)

When adding a feature, add a type file and a resolver file, then register both in their respective `index.ts`.

**Layers:** resolvers hold business logic and authz; `src/data/models/schemas/*` hold Mongoose schemas (exported as a `ModelsMap` from [src/data/models/index.ts](src/data/models/index.ts)); `src/dto/*` format DB documents into API responses. Keep formatting out of resolvers and in DTOs.

**Auth & data isolation:** call `context.di.authValidation.ensureThatUserIsLogged(context)` first, get the user with `getUser(context)`, and scope every query by `user_id: user._id`. Admin-only actions use `ensureThatUserIsAdministrator`.

**Startup sequence** (in `server.ts`, on DB `open`): ensure indexes → upsert default expense categories → start Express/Apollo. The category seed data in [src/config/defaultData.ts](src/config/defaultData.ts) must not be modified without explicit user consent (see AGENTS.md §6). Introspection and the GraphQL Playground are enabled only outside production.

## Conventions

- **ESM with `NodeNext`**: local imports use `.js` extensions even though sources are `.ts` (e.g. `import { logger } from '#/helpers/logger.js'`).
- **Path alias `#/*` → `src/*`**: configured in three places — `tsconfig.json` (types), `vitest.config.js` (tests, as `#`), and `tsc-alias` (build output). Keep them in sync.
- **ESLint style is enforced**: tabs for indentation, single quotes, required semicolons, `no-magic-numbers` (warn). Tests relax `no-magic-numbers`.
- **Tests mock the models module** with `vi.mock('#/data/models/index.js')` rather than hitting a real database; `tests/` mirrors `src/`.
