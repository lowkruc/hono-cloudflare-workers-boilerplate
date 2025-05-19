# Gohono Cloudflare API Documentation

This document provides detailed information about the API endpoints available in the Gohono Cloudflare boilerplate.

## Table of Contents

- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Authentication](#authentication-endpoints)
  - [Users](#users)

## Base URLs

- **Development**: `http://localhost:8787`
- **Staging**: `https://gohono-staging.[your-worker-subdomain].workers.dev`
- **Production**: `https://[your-worker-subdomain].workers.dev`

## Authentication

The API supports two authentication methods:

### JWT Bearer Token

For programmatic API access, you can use JWT bearer tokens in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### HTTP Cookies

For web applications, authentication is also supported via HTTP cookies, which are automatically handled by browsers:

- `auth_token`: Contains the JWT token for authentication
- `refresh_token`: Contains a token used to refresh the authentication when it expires

## Response Format

All responses are returned in JSON format.

### Success Response

```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## Error Handling

| Status Code | Description                                           |
|-------------|-------------------------------------------------------|
| 400         | Bad Request - Invalid input or parameters             |
| 401         | Unauthorized - Authentication required                |
| 403         | Forbidden - Insufficient permissions                  |
| 404         | Not Found - Resource not found                        |
| 409         | Conflict - Resource already exists                    |
| 422         | Unprocessable Entity - Validation error               |
| 429         | Too Many Requests - Rate limit exceeded               |
| 500         | Internal Server Error - Unexpected server error       |

## Endpoints

### Health Check

#### Get API Status

```
GET /
```

Response (200 OK):

```json
{
  "status": "success",
  "data": {
    "message": "Gohono Cloudflare API is running",
    "timestamp": "2025-05-19T03:45:10.021Z",
    "environment": "development",
    "version": "1.0.0"
  }
}
```

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd",
  "name": "John Doe"
}
```

Response (201 Created):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-05-19T04:00:00.000Z"
    },
    "token": "jwt_token_example"
  }
}
```

#### Login

```
POST /api/auth/login
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd"
}
```

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_example"
  }
}
```

HTTP Headers in response:
```
Set-Cookie: auth_token=jwt_token_example; HttpOnly; Secure; SameSite=Strict; Path=/
Set-Cookie: refresh_token=refresh_token_example; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh
```

#### Refresh Token

```
POST /api/auth/refresh
```

Automatically uses the refresh_token cookie, no request body needed.

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "token": "new_jwt_token_example"
  }
}
```

HTTP Headers in response:
```
Set-Cookie: auth_token=new_jwt_token_example; HttpOnly; Secure; SameSite=Strict; Path=/
```

#### Logout

```
POST /api/auth/logout
```

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "message": "Successfully logged out"
  }
}
```

HTTP Headers in response:
```
Set-Cookie: auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
Set-Cookie: refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

### Users

#### Get Current User

```
GET /api/users/me
```

*Requires Authentication*

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-05-19T03:00:00.000Z",
      "updatedAt": "2025-05-19T03:00:00.000Z"
    }
  }
}
```

#### Get User by ID

```
GET /api/users/:id
```

*Requires Authentication*

Path Parameters:
- `id`: The unique identifier of the user

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-05-19T03:00:00.000Z",
      "updatedAt": "2025-05-19T03:00:00.000Z"
    }
  }
}
```

#### List Users

```
GET /api/users
```

*Requires Authentication with Admin Role*

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Number of users per page (default: 10)
- `role`: Filter users by role (optional)

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "user-uuid-1",
        "email": "user1@example.com",
        "name": "User One",
        "role": "user",
        "createdAt": "2025-05-19T03:00:00.000Z",
        "updatedAt": "2025-05-19T03:00:00.000Z"
      },
      {
        "id": "user-uuid-2",
        "email": "user2@example.com",
        "name": "User Two",
        "role": "admin",
        "createdAt": "2025-05-19T03:00:00.000Z",
        "updatedAt": "2025-05-19T03:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

#### Update User

```
PATCH /api/users/:id
```

*Requires Authentication (user can only update their own profile unless they have admin role)*

Path Parameters:
- `id`: The unique identifier of the user

Request Body:
```json
{
  "name": "Updated Name",
  "password": "NewSecureP@ssw0rd"  // Optional
}
```

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "Updated Name",
      "role": "user",
      "updatedAt": "2025-05-19T04:30:00.000Z"
    }
  }
}
```

#### Delete User

```
DELETE /api/users/:id
```

*Requires Authentication with Admin Role*

Path Parameters:
- `id`: The unique identifier of the user

Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "message": "User deleted successfully"
  }
}
``` 