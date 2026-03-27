# Project Agents and Instructions: didibudget-backend

This document serves as the primary context and instruction set for AI assistants working on the **didibudget-backend** project.

---

## 1. Project Overview & Tech Stack
**didibudget-backend** is a budget management API built with Node.js, Express, GraphQL, and MongoDB.
- **Runtime:** Node.js 18.20.x
- **Framework:** Express 4.21.x + Apollo Server 3.13.x
- **Database:** MongoDB 8.0+ (Mongoose ODM)
- **GraphQL:** GraphQL 16.12.x with schema stitching
- **Authentication:** JWT (jsonwebtoken 9.0.x)
- **Testing:** Jest 29.7.x
- **Code Quality:** ESLint 8.57.x, Husky (pre-commit hooks)

### Project Structure
```text
src/
├── config/              # Configuration files (appConfig, environment, defaultData)
├── dto/                 # Data Transfer Objects (formatting logic)
├── gql/                 # GraphQL: types/, resolvers/, mutations/
├── models/              # Mongoose schemas
├── services/            # Business logic
├── middleware/          # Express middleware
└── server.js            # Application entry point
tests/                   # Jest tests mirroring source structure
```


### Common Commands
- **Start dev server:** `npm run dev` (with hot reload via nodemon)
- **Run tests:** `npm test` or `npm run test:watch`
- **Lint code:** `npm run lint` (ESLint)
- **Fix linting issues:** `npm run lint -- --fix`
- **Clean logs:** `npm run clean` (removes logs/ directory)

---

## 2. Global Development Guidelines

### ✅ Always Do
- **Verify Safety:** Run `npm test` and `npm run lint` before suggesting changes.
- **Follow Patterns:** Adhere to existing code patterns and naming conventions.
- **Documentation:** Use JSDoc for complex functions and logic.
- **Environment:** Reference `.env` for secrets; never hardcode credentials.
- **Separation of Concerns:** Keep logic in `services/` and formatting in `dto/`.

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
  id: ID!
  amount: Float!
  category: String!
  description: String
  date: String!
  userId: ID!
  createdAt: String!
}

input CreateExpenseInput {
  amount: Float!
  category: String!
  description: String
  date: String!
}

type Query {
  getExpense(id: ID!): Expense
  listExpenses(limit: Int, offset: Int): [Expense!]!
}

type Mutation {
  createExpense(input: CreateExpenseInput!): Expense!
  updateExpense(id: ID!, input: CreateExpenseInput!): Expense!
  deleteExpense(id: ID!): Boolean!
}
```

#### Resolver Implementation
Resolvers (in `src/gql/resolvers/` or `mutations/`) must follow these rules:
- Use **Dependency Injection** via `context.di`.
- Always check **Authentication** before logic.
- Return data formatted via **DTOs**.

**Example Implementation:**
```javascript
module.exports = {
  Query: {
    /**
     * Get all expenses for authenticated user
     */
    getExpenses: async (parent, args, context) => {
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
    getExpensesWithPagination: async (parent, { page, pageSize }, context) => {
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
  },

  Mutation: {
    /**
     * Register a new expense for authenticated user
     */
    registerExpense: async (parent, { category, quantity, date }, context) => {
      context.di.authValidation.ensureThatUserIsLogged(context);
      context.di.datetimeValidation.ensureDateIsValid(date);

      const user = await context.di.authValidation.getUser(context);

      return context.di.model.Expenses({
        user_id: user._id,
        category,
        quantity,
        date
      }).save()
        .then(expense => expenseDTO(expense));
    },

    /**
     * Delete expense for authenticated user
     */
    deleteExpense: async (parent, { uuid }, context) => {
      context.di.authValidation.ensureThatUserIsLogged(context);

      const user = await context.di.authValidation.getUser(context);

      return context.di.model.Expenses
        .findOneAndDelete({ uuid, user_id: user._id })
        .then(expense => expenseDTO(expense));
    }
  }
};
```

### Security & Data Isolation
- **Authentication:** Use `context.di.authValidation.ensureThatUserIsLogged(context)`.
- **Identity:** Always filter queries using `user_id: user._id` to ensure data isolation.
- **Permissions:** Use `context.di.authValidation.ensureThatUserIsAdministrator(context)` for restricted actions.

Example with Authentication Checks:  

```javascript
registerExpense: async (parent, { category, quantity, date }, context) => {
  // Always check authentication first
  context.di.authValidation.ensureThatUserIsLogged(context);
  
  // Validate input parameters
  context.di.datetimeValidation.ensureDateIsValid(date);

  // Get authenticated user
  const user = await context.di.authValidation.getUser(context);

  // Proceed with user_id = user._id to associate expense with this user
  return context.di.model.Expenses({
    user_id: user._id,
    category,
    quantity,
    date
  }).save();
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

The category lists and default data included in this repository (for example, files as `src/config/defaultData.js` and related resources) are used to populate the application's database. Under no circumstances should these categories be modified, renamed, removed, or otherwise altered without the explicit, documented consent of the end-user. Unauthorized changes may cause data loss, inconsistencies, or broken migrations.

If a change to the default categories is required, you should obtain explicit consent from the end-user before.
