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

## API Documentation

### Base URL

- Development: `http://localhost:8787`
- Production: `https://[your-worker-subdomain].workers.dev`

### Response Format

All responses are returned in JSON format with the following structure for success:

```json
{
  "status": "ok",
  "data": { ... }
}
```

And the following for errors:

```json
{
  "status": "error",
  "message": "Error message"
}
```

### Health Check

```
GET /
```

Response:

```json
{
  "status": "ok",
  "message": "Gohono Cloudflare API is running",
  "timestamp": "2025-05-19T03:45:10.021Z",
  "environment": "development"
}
```

### Users API

#### Get User by ID

```
GET /api/users/:id
```

Path Parameters:
- `id`: The unique identifier of the user

Response (200 OK):
```json
{
  "id": "uuid-1234",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2025-05-19T03:00:00.000Z",
  "updatedAt": "2025-05-19T03:00:00.000Z"
}
```

Error Responses:
- 404 Not Found: User with the given ID does not exist
- 500 Internal Server Error: Server processing error

#### List Users (Example Future Endpoint)

```
GET /api/users
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Number of users per page (default: 10)

Response (200 OK):
```json
{
  "users": [
    {
      "id": "uuid-1234",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-05-19T03:00:00.000Z",
      "updatedAt": "2025-05-19T03:00:00.000Z"
    },
    ...
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### Create User (Example Future Endpoint)

```
POST /api/users
```

Request Body:
```json
{
  "email": "new-user@example.com",
  "name": "New User",
  "role": "user"
}
```

Response (201 Created):
```json
{
  "id": "uuid-5678",
  "email": "new-user@example.com",
  "name": "New User",
  "role": "user",
  "createdAt": "2025-05-19T04:00:00.000Z",
  "updatedAt": "2025-05-19T04:00:00.000Z"
}
```

Error Responses:
- 400 Bad Request: Invalid input data
- 409 Conflict: Email already exists
- 500 Internal Server Error: Server processing error

### Error Codes

| Status Code | Description                                           |
|-------------|-------------------------------------------------------|
| 400         | Bad Request - Invalid input or parameters             |
| 401         | Unauthorized - Authentication required                |
| 403         | Forbidden - Insufficient permissions                  |
| 404         | Not Found - Resource not found                        |
| 409         | Conflict - Resource already exists                    |
| 422         | Unprocessable Entity - Validation error               |
| 500         | Internal Server Error - Unexpected server error       |

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