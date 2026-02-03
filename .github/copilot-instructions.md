# Copilot Instructions for didibudget-backend

## Project Overview
**didibudget-backend** is a budget management API built with Node.js, Express, GraphQL, and MongoDB. It handles user authentication, expense tracking, and financial analytics.

## Tech Stack
- **Runtime:** Node.js 18.20.x
- **Framework:** Express 4.21.x + Apollo Server 3.13.x
- **Database:** MongoDB 8.0+ (Mongoose ODM)
- **Testing:** Jest 29.7.x
- **Code Quality:** ESLint 8.57.x, Husky for git hooks
- **Authentication:** JWT (jsonwebtoken 9.0.x)
- **GraphQL:** GraphQL 16.12.x with schema stitching

## Project Structure
```
src/
├── config/              # Configuration files
│   ├── appConfig.js
│   ├── environment.js
│   └── defaultData.js
├── dto/                 # Data Transfer Objects
│   ├── expenseDTO.js
│   ├── monthlyBalanceDTO.js
│   └── ...
├── gql/                 # GraphQL definitions
│   ├── types/           # GraphQL type definitions
│   ├── resolvers/       # GraphQL resolvers
│   └── mutations/       # GraphQL mutations
├── models/              # Mongoose schemas
├── services/            # Business logic
├── middleware/          # Express middleware
└── server.js            # Application entry point
tests/                   # Jest tests
.husky/                  # Git hooks (linting, testing)
```

## Common Commands
- **Start dev server:** `npm run dev` (with hot reload via nodemon)
- **Run tests:** `npm test` or `npm run test:watch`
- **Lint code:** `npm run lint` (ESLint)
- **Fix linting issues:** `npm run lint -- --fix`
- **Clean logs:** `npm run clean` (removes logs/ directory)

## Architecture Patterns

### GraphQL Resolvers
Resolvers follow this pattern:
```javascript
const resolver = {
  Query: {
    myQuery: async (_, args, context) => {
      // Extract auth info from context if needed
      // Call service methods
      return result;
    }
  }
};
```

### Authentication
- JWT tokens passed via `Authorization` header
- Context includes authenticated user info
- JWT_SECRET stored in `.env`

### Error Handling
- Use Apollo error formatting
- Return meaningful error messages
- Log errors using log4js

## Security & Boundaries

### ✅ Always Do
- Run tests before suggesting changes: `npm test`
- Check for linting errors: `npm run lint`
- Follow existing code patterns and naming conventions
- Respect separation between `src/` (logic) and `tests/` (testing)
- Use TypeScript/JSDoc comments for complex functions
- Reference `.env` for secrets (never hardcode credentials)

### ⚠️ Ask First
- Before modifying database schemas (Mongoose models)
- Before changing API routes or GraphQL types
- Before adding new dependencies
- Before refactoring large services
- Before run git add, git commit, git push, or git checkout automatically. Ask for explicit confirmation before any git-related action.


### 🚫 Never Do
- Commit `.env` or any secrets
- Modify production environment variables
- Remove or skip failing tests
- Change test file permissions
- Commit to `node_modules/` or build artifacts
- Modify ESLint config without discussion

## Development Workflow
1. Create feature branch from `master`
2. Make changes following existing patterns
3. Run `npm run lint --fix` to auto-fix style issues
4. Run `npm test` to verify tests pass
5. Commit with meaningful messages (husky pre-commit hooks will run)
6. Create pull request

## Testing Standards
- Unit tests in `tests/` mirror source structure when possible
- Test names describe expected behavior
- Jest configuration in `package.json`
- Aim for meaningful coverage, not 100%

## Documentation
- Keep README.md updated with setup instructions
- Add JSDoc comments to exported functions
- Document complex business logic
- Update this file if project structure changes

## Recommended Copilot Agents
This repository includes specialized Copilot agents:
- **@test-agent** - Writes and improves test coverage
- **@lint-agent** - Fixes code style and formatting
- **@api-agent** - Builds and modifies GraphQL endpoints

Use `@agent-name` syntax to invoke specific agents for focused assistance.
