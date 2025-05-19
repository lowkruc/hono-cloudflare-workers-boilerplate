# Contributing to Gohono Cloudflare Boilerplate

Thank you for your interest in contributing to the Gohono Cloudflare Boilerplate! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## How to Contribute

### 1. Fork and Clone

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/gohono-boilerplate.git
   cd gohono-boilerplate
   ```

### 2. Setup Development Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your development environment:
   ```bash
   # Create development database
   wrangler d1 create gohono_dev --env dev
   
   # Update wrangler.toml with your database ID
   # Then run migrations
   npm run migrate:dev
   ```

### 3. Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards:
   - Follow TypeScript best practices
   - Write tests for new features
   - Update documentation as needed
   - Follow the project's clean architecture principles

3. Run tests and linting:
   ```bash
   npm test
   npm run lint
   ```

4. Commit your changes:
   ```bash
   git commit -m "feat: add new feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

### 4. Pull Request Process

1. Create a Pull Request from your fork to the main repository
2. Fill out the PR template completely
3. Ensure all CI checks pass
4. Wait for review and address any feedback

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid using `any` type
- Use async/await for asynchronous operations

### Testing

- Write unit tests for all new features
- Maintain existing test coverage
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

### Documentation

- Update README.md for major changes
- Document new API endpoints in docs/api.md
- Add JSDoc comments for public functions
- Keep architecture documentation up to date

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Project Structure

Follow the existing project structure:

```
src/
├── domain/          # Business entities and interfaces
├── application/     # Use cases and business logic
├── interfaces/      # Controllers and routes
└── infrastructure/  # External services and implementations
```

## Development Guidelines

1. **Clean Architecture**
   - Keep domain layer independent
   - Use dependency injection
   - Follow SOLID principles

2. **Testing**
   - Write tests before implementing features (TDD)
   - Maintain high test coverage
   - Use meaningful test descriptions

3. **Error Handling**
   - Use proper error types
   - Implement error boundaries
   - Log errors appropriately

4. **Security**
   - Follow security best practices
   - Validate all inputs
   - Use proper authentication and authorization

## Getting Help

- Open an issue for bugs or feature requests
- Join our community chat for discussions
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 