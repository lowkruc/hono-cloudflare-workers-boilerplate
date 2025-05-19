# Hono Cloudflare Workers Boilerplate

A clean architecture boilerplate for Hono on Cloudflare Workers with TDD and best practices.

## Features

- 🚀 [Hono](https://hono.dev/) - Fast, lightweight web framework for the edge
- ☁️ [Cloudflare Workers](https://workers.cloudflare.com/) - Edge runtime environment
- 🏛️ Clean Architecture structure
- 🧪 TDD setup with [Vitest](https://vitest.dev/)
- 📊 D1 Database integration with full migration support
- 🔄 Automated CI/CD pipeline
- 📝 Structured logging
- ✅ TypeScript for type safety
- 📏 ESLint + Prettier for code quality
- 🔍 Zod for validation

## Project Structure

```
src/
├── domain/                  # Enterprise business rules
│   ├── entities/            # Business entities
│   └── repositories/        # Repository interfaces
├── application/             # Application business rules
│   └── usecases/            # Application use cases
├── interfaces/              # Interface adapters
│   ├── controllers/         # Controllers
│   └── routes/              # Route definitions
├── infrastructure/          # Frameworks and drivers
│   ├── database/            # Database migrations and seeds
│   │   ├── migrations/      # D1 SQL migrations
│   │   └── tools/           # Migration management tools
│   ├── logger/              # Logging utility
│   └── worker.ts            # Main worker entry point
└── test/                    # Test setup and utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lowkruc/hono-cloudflare-workers-boilerplate.git
cd hono-cloudflare-workers-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Configure Wrangler:

Edit `wrangler.toml` and replace placeholder IDs with your own Cloudflare D1 and KV namespace IDs.

### Development

Start the development server:

```bash
npm run dev
```

### Testing

Run tests:

```bash
npm test
```

With watch mode:

```bash
npm run test:watch
```

Get test coverage:

```bash
npm run test:coverage
```

### Database Management

Create a D1 database (one-time setup):

```bash
wrangler d1 create gohono
wrangler d1 create gohono_dev --env dev
wrangler d1 create gohono_staging --env staging
```

Update your `wrangler.toml` with the generated database IDs.

#### Migration Management

This project includes a comprehensive migration system for Cloudflare D1:

Create a new migration:

```bash
npm run migrate:create <migration_name>
# Example: npm run migrate:create add_users_table
```

Apply migrations:

```bash
npm run migrate        # Apply migrations to production
npm run migrate:dev    # Apply migrations to development environment
npm run migrate:staging # Apply migrations to staging environment
```

Rollback the latest migration:

```bash
npm run migrate:rollback        # Default to dev environment
npm run migrate:rollback staging # Rollback in staging environment
```

Seed the database:

```bash
npm run seed
```

### Deployment

Deploy to Cloudflare:

```bash
npm run deploy
```

Deploy to a specific environment:

```bash
npm run deploy -- --env dev
```

## Documentation

- [API Documentation](docs/api.md) - Detailed API endpoint documentation
- [Architecture](docs/architecture.md) - Project architecture and design decisions
- [Contributing](docs/contributing.md) - Guidelines for contributing to the project

## CI/CD

This project includes a GitHub Actions workflow for CI/CD in `.github/workflows/ci-cd.yml`. The workflow:

1. Runs tests and linting on every push and pull request
2. Deploys to the dev environment on pull requests
3. Deploys to production when merging to main

## Clean Architecture

This project follows Clean Architecture principles with 4 main layers:

1. **Domain Layer**: Contains business entities and repository interfaces.
2. **Application Layer**: Contains use cases that orchestrate the flow of data.
3. **Interface Layer**: Contains controllers and routes that adapt external inputs.
4. **Infrastructure Layer**: Contains implementations specific to Cloudflare Workers.

## Migration System

The migration system follows these principles:

1. **Versioned Migrations**: Each migration is numbered sequentially (0000, 0001, etc.).
2. **Up/Down Migrations**: All migrations include both up (apply) and down (rollback) statements.
3. **Environment Support**: Migrations can be applied to different environments (dev, staging, prod).
4. **Transactional**: Migrations are wrapped in transactions to ensure database consistency.
5. **State Tracking**: Migration state is stored in the D1 database.

Migration files follow this format:
```sql
-- Migration: name_of_migration
-- Description: What this migration does
-- Created: 2023-01-01T00:00:00.000Z

-- Up migration
CREATE TABLE my_table (
  id TEXT PRIMARY KEY
);

-- Down migration
-- Add DOWN migration statements below (commented out)
-- -- DROP TABLE my_table;
```

## Test-Driven Development (TDD)

This project follows TDD principles:
1. Write a failing test for a feature
2. Write the minimum code to make the test pass
3. Refactor the code while keeping tests passing

## License

MIT 