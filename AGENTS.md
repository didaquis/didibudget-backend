# Project Agents and Instructions: didibudget-backend

This document serves as the primary context and instruction set for AI assistants working on the **didibudget-backend** project.

---

## 1. Project Overview & Tech Stack
**didibudget-backend** is a budget management API built with Node.js, Express, GraphQL, and MongoDB.
- **Runtime:** Node.js 24.14.x
- **Language:** TypeScript 5.9.x
- **Framework:** Express 4.22.x + Apollo Server 3.13.x
- **Database:** MongoDB 8.0+ (Mongoose ODM)
- **GraphQL:** GraphQL 16.13.x with schema stitching
- **Authentication:** JWT (jsonwebtoken 9.0.x)
- **Dev Server:** tsx (TypeScript execution with hot reload)
- **Testing:** Vitest 3.2.x (native TypeScript support)
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
- Before adding new dependencies or refactoring large services.
- Before performing Git operations (commit, push, checkout).
- Before changing authentication/authorization patterns
- Before implementing complex caching strategies
- Before break existing API contracts

### 🚫 Never Do
- Commit `.env` files or any secrets.
- Modify production environment variables.
- Remove or skip failing tests.
- Commit `node_modules/` or build artifacts.

---

## 3. API Design Patterns

#### GraphQL Schema Definition
Define types in `src/gql/types/` using clear structures and inputs.
```graphql
type Expense {
  user_id: ID!
  category: ID!
  subcategory: ID
  quantity: Float!
  date: String!
  currencyISO: String!
  uuid: String!
}

type Query {
  getExpenses: [Expense]
  getExpensesWithPagination(page: Int!, pageSize: Int!): PaginatedExpenses
  deleteExpense(uuid: String!): Expense
}

type Mutation {
  registerExpense(category: ID!, subcategory: ID, quantity: Float!, date: String!): Expense
  deleteExpense(uuid: String!): Expense
  deleteAllExpenses: DeleteResult
}
```

#### Resolver Implementation
Resolvers (in `src/gql/resolvers/`) must follow these rules:
- Use **Dependency Injection** via `context.di`.
- Always check **Authentication** before logic.
- Return data formatted via **DTOs**.
- Use `Context` from `#/gql/auth/setContext.js` for the context type — never use `any`.
- Use `#/` path aliases for all imports within `src/`.

**Example Implementation:**
```typescript
import type { Context } from '#/gql/auth/setContext.js';
import { expenseDTO, type ExpenseDTO } from '#/dto/expenseDTO.js';
import { getOffset } from '#/helpers/pagingUtilities.js';

export const Query = {
  /**
   * Get all expenses for authenticated user
   */
  getExpenses: async (_parent: unknown, _args: unknown, context: Context): Promise<ExpenseDTO[]> => {
    context.di.authValidation.ensureThatUserIsLogged(context);

    const user = await context.di.authValidation.getUser(context);

    const sortCriteria = { date: 'asc' };
    const allExpenses = await context.di.model.Expenses
      .find({ user_id: user._id })
      .sort(sortCriteria)
      .lean();

    return allExpenses.map((expense) => expenseDTO(expense));
  },

  /**
   * Get expenses with pagination for authenticated user
   */
  getExpensesWithPagination: async (_parent: unknown, { page, pageSize }: { page: number; pageSize: number }, context: Context) => {
    context.di.authValidation.ensureThatUserIsLogged(context);
    context.di.pagingValidation.ensurePageValueIsValid(page);
    context.di.pagingValidation.ensurePageSizeValueIsValid(pageSize);

    const user = await context.di.authValidation.getUser(context);

    const offset = getOffset(page, pageSize);
    const expenses = await context.di.model.Expenses
      .find({ user_id: user._id })
      .skip(offset)
      .limit(pageSize)
      .lean();

    return expenses.map((expense) => expenseDTO(expense));
  }
};

export const Mutation = {
  /**
   * Register a new expense for authenticated user
   */
  registerExpense: async (_parent: unknown, { category, quantity, date }: { category: string; quantity: number; date: string }, context: Context): Promise<ExpenseDTO> => {
    context.di.authValidation.ensureThatUserIsLogged(context);
    context.di.datetimeValidation.ensureDateIsValid(date);

    const user = await context.di.authValidation.getUser(context);

    return new context.di.model.Expenses({
      user_id: user._id,
      category,
      quantity,
      date
    }).save()
      .then((expense) => expenseDTO(expense));
  },

  /**
   * Delete expense for authenticated user
   */
  deleteExpense: async (_parent: unknown, { uuid }: { uuid: string }, context: Context): Promise<ExpenseDTO | null> => {
    context.di.authValidation.ensureThatUserIsLogged(context);

    const user = await context.di.authValidation.getUser(context);

    return context.di.model.Expenses
      .findOneAndDelete({ uuid, user_id: user._id })
      .then((expense) => expense ? expenseDTO(expense) : null);
  }
};
```

### Security & Data Isolation
- **Authentication:** Use `context.di.authValidation.ensureThatUserIsLogged(context)`.
- **Identity:** Always filter queries using `user_id: user._id` to ensure data isolation.
- **Permissions:** Use `context.di.authValidation.ensureThatUserIsAdministrator(context)` for restricted actions.

Example with Authentication Checks:  

```typescript
registerExpense: async (_parent: unknown, { category, quantity, date }: { category: string; quantity: number; date: string }, context: Context): Promise<ExpenseDTO> => {
  // Always check authentication first
  context.di.authValidation.ensureThatUserIsLogged(context);

  // Validate input parameters
  context.di.datetimeValidation.ensureDateIsValid(date);

  // Get authenticated user — always throws if not authenticated, never returns null
  const user = await context.di.authValidation.getUser(context);

  // Proceed with user_id = user._id to associate expense with this user
  return new context.di.model.Expenses({
    user_id: user._id,
    category,
    quantity,
    date
  }).save()
    .then((expense) => expenseDTO(expense));
}
```

### Error Handling
Throw proper Apollo errors:
- `AuthenticationError`: Missing or invalid token.
- `ForbiddenError`: Insufficient permissions.
- `UserInputError`: Invalid parameters.
- `ValidationError`: Failed business logic validation.

---

## 4. Testing & Workflow
- **Coverage:** Aim for meaningful test coverage in `tests/`.
- **Linting:** Run `npm run lint --fix` to auto-fix style issues.
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
