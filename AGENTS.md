# Project Agents and Instructions: didibudget-backend

This document serves as the primary context and instruction set for AI assistants working on the **didibudget-backend** project.

---

## 1. Project Overview & Tech Stack
**didibudget-backend** is a budget management API built with Node.js, Express, GraphQL, and MongoDB.

Version numbers below are the majors the project targets; `package.json`, `package-lock.json`, and `.nvmrc` are the source of truth for exact versions.

- **Runtime:** Node.js 24.x (see `.nvmrc` / `engines`)
- **Language:** TypeScript 5.x
- **Framework:** Express 4.x + Apollo Server 5.x (`@apollo/server` with `@as-integrations/express4`)
- **Database:** MongoDB 8.0+ (Mongoose 8.x ODM)
- **GraphQL:** GraphQL 16.x with schema stitching
- **Authentication:** JWT (jsonwebtoken 9.x)
- **Dev Server:** tsx (TypeScript execution with hot reload)
- **Testing:** Vitest 3.x (native TypeScript support)
- **Code Quality:** typescript-eslint (ESLint 9 flat config), Husky (pre-commit hooks)

### Project Structure
```text
src/
├── config/              # Configuration files (appConfig, environment, defaultData)
├── data/
│   └── models/          # Mongoose schemas and model definitions
├── dto/                 # Data Transfer Objects (formatting logic)
├── gql/
│   ├── auth/            # Apollo context setup, JWT, auth validations
│   ├── resolvers/       # GraphQL resolvers (queries and mutations)
│   └── types/           # GraphQL type definitions
├── helpers/             # Utility functions (paging, validation, logging, etc.)
├── routes/              # Express routes
├── types/               # Shared TypeScript type declarations
└── server.ts            # Application entry point
tests/                   # Tests mirroring source structure
```


### Common Commands
- **Start dev server:** `npm run dev` (with hot reload via tsx)
- **Run tests:** `npm test` or `npm run test:watch`
- **Type check:** `npm run typecheck`
- **Lint code:** `npm run lint` (ESLint)
- **Fix linting issues:** `npm run lint -- --fix`
- **Clean logs:** `npm run clean` (removes logs/ directory)

---

## 2. Global Development Guidelines

### ✅ Always Do
- **Verify Safety:** Run `npm test` and `npm run lint` before suggesting changes.
- **Follow Patterns:** Adhere to existing code patterns and naming conventions.
- **Documentation:** Use TypeScript types/interfaces + descriptive comments for complex functions and logic.
- **Environment:** Reference `.env` for secrets; never hardcode credentials.
- **Separation of Concerns:** Keep logic in resolvers/helpers and formatting in `dto/`.

### ⚠️ Ask First
- Before modifying database schemas (Mongoose models).
- Before changing API routes or GraphQL types.
- Before changing authentication/authorization patterns
- Before implementing complex caching strategies
- Before breaking existing API contracts

### 🚫 Never Do
- Commit `.env` files or any secrets.
- Modify production environment variables.
- Remove or skip failing tests.
- Commit `node_modules/` or build artifacts.

---

## 3. API Design Patterns

#### GraphQL Schema Definition
Type definitions live in `src/gql/types/*` (one file per domain) and are aggregated by `src/gql/types/index.ts`. Reads go under `type Query`, writes under `type Mutation` — never mix them. Use `ID!` for required references, mark optional fields without `!`, and add matching `input` types for complex mutation arguments.

The canonical schema is the code itself — read the relevant type file rather than trusting a copy here, which would drift. For example, the expense types are defined in [src/gql/types/expenses.ts](src/gql/types/expenses.ts).

#### Resolver Implementation
Resolvers (in `src/gql/resolvers/`) must follow these rules:
- Use **Dependency Injection** via `context.di`.
- Always check **Authentication** before logic.
- Return data formatted via **DTOs**.
- Use `Context` from `#/gql/auth/setContext.js` for the context type — never use `any`.
- Use `#/` path aliases for all imports within `src/`.

**Mandatory sequence — every resolver follows this skeleton:**
```typescript
import type { Context } from '#/gql/auth/setContext.js';
import { expenseDTO, type ExpenseDTO } from '#/dto/expenseDTO.js';

someResolver: async (_parent: unknown, args: SomeArgs, context: Context): Promise<ExpenseDTO> => {
  context.di.authValidation.ensureThatUserIsLogged(context); // 1. auth first, always
  context.di.datetimeValidation.ensureDateIsValid(args.date); // 2. validate input via context.di.*Validation

  const user = await context.di.authValidation.getUser(context); // 3. resolve the user (throws if absent)

  // 4. every DB call is scoped by user_id: user._id for data isolation
  const doc = await context.di.model.Expenses.find({ user_id: user._id }).lean();

  return expenseDTO(doc); // 5. format through a DTO, never return raw documents
};
```

This skeleton shows the *order*, which is non-negotiable. For the real, working resolvers (queries, mutations, pagination, sorting) read the source directly — e.g. [src/gql/resolvers/expenses.ts](src/gql/resolvers/expenses.ts) — rather than copying an example that may drift.

### Security & Data Isolation
These rules are non-negotiable and are baked into the resolver skeleton above:
- **Authentication:** Call `context.di.authValidation.ensureThatUserIsLogged(context)` before any other logic.
- **Identity:** Always filter *every* query and mutation by `user_id: user._id` to guarantee data isolation between users.
- **Permissions:** Use `context.di.authValidation.ensureThatUserIsAdministrator(context)` for admin-restricted actions.
- **DTOs:** Never return raw Mongoose documents; format through a DTO so internal fields are not leaked.

### Error Handling
Throw the application error classes from `#/gql/errors.js` (`src/gql/errors.ts`). These extend `GraphQLError` and set the `extensions.code` that clients rely on. Do not import error classes from Apollo Server — Apollo Server v4+ no longer ships them.
- `AuthenticationError` (code `UNAUTHENTICATED`): Missing or invalid token.
- `ForbiddenError` (code `FORBIDDEN`): Insufficient permissions.
- `UserInputError` (code `BAD_USER_INPUT`): Invalid parameters.
- `ValidationError` (code `GRAPHQL_VALIDATION_FAILED`): Failed business logic validation.

Keep these `extensions.code` values stable: the frontend branches on `error.extensions.code` (e.g. it logs the user out on `UNAUTHENTICATED`/`FORBIDDEN`).

---

## 4. Testing & Workflow
- **Coverage:** Aim for meaningful test coverage in `tests/`.
- **Linting:** Run `npm run lint -- --fix` to auto-fix style issues.
- **Deployment:** Feature branches must pass all tests before being merged into master or pushed to a remote repository.
- **Write tests** for new critical code
- **Mock MongoDB** as needed


## 5. Performance Considerations
- Use `.select()` to limit fields in queries
- Implement pagination for large result sets
- Consider N+1 query problems with nested resolvers
- Use indexes on frequently queried fields

---

## 6. Default Data on database — Do Not Modify Without Consent

The category lists and default data included in this repository (for example, files as `src/config/defaultData.ts` and related resources) are used to populate the application's database. Under no circumstances should these categories be modified, renamed, removed, or otherwise altered without the explicit, documented consent of the end-user. Unauthorized changes may cause data loss, inconsistencies, or broken migrations.

If a change to the default categories is required, you should obtain explicit consent from the end-user before.

---

## 7. Code quality guidelines

- No hacks or quick fixes. We do not accept sloppy, fragile, or shortcut-based solutions. Code must be robust, intentional, and maintainable.
- Readability over cleverness. Prefer clear, explicit, and easy-to-understand code over compact, overly clever, or cryptic implementations.
- Maintainability first. Write code that is easy to reason about, modify, and debug by other developers in the future.
- Tests are expected. Most non-trivial code must be accompanied by appropriate unit tests. Tests should be meaningful, readable, and cover the main execution paths and edge cases.
- Consistency matters. Follow existing project conventions, naming standards, and architectural patterns.
- Fail explicitly. Handle errors clearly and predictably; avoid silent failures or ambiguous behavior.
- TypeScript over JavaScript. Prefer TypeScript instead of JavaScript. Use strict typing, explicit interfaces, and meaningful types to improve correctness and maintainability.
- Avoid type casts. Do not use `as any`, `as unknown as X`, or unnecessary casts. If a cast seems necessary, investigate whether the underlying types are modelled correctly first.
