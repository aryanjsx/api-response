# @aryanjsx/api-response

A lightweight, dependency-free TypeScript library for standardizing REST API responses in Express.js backends.

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/@aryanjsx/api-response)](https://www.npmjs.com/package/@aryanjsx/api-response)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-green.svg)](https://nodejs.org/)

## The Problem

Building REST APIs often leads to inconsistent response formats across different endpoints and developers. This inconsistency creates:

- **Frontend frustration**: Developers never know what shape to expect from responses
- **Debugging nightmares**: Error formats vary wildly across endpoints
- **Documentation overhead**: Every endpoint needs custom response documentation
- **Code duplication**: The same response formatting logic scattered everywhere

## The Solution

`@aryanjsx/api-response` provides a simple, consistent API for all your response needs with full TypeScript support:

```json
// ✅ Every success response has the same structure
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": { "id": 1, "name": "John" },
  "meta": { "timestamp": "2024-01-15T10:30:00.000Z" }
}

// ✅ Every error response is predictable
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "meta": { "timestamp": "2024-01-15T10:30:00.000Z" }
}
```

## Compatibility

### ✅ Supported Environments

This library is designed for **server-side/backend** use:

| Environment | Status | Notes |
|-------------|--------|-------|
| **Express.js** | ✅ Fully Supported | Primary target framework |
| **Node.js** | ✅ Fully Supported | v16+ required |
| **TypeScript** | ✅ Fully Supported | Full type definitions included |
| **JavaScript (ES Modules)** | ✅ Fully Supported | Modern ESM syntax |
| **Fastify** | ⚠️ Partial | Works with Express-compatible response wrapper |
| **Koa** | ⚠️ Partial | Works with Express-compatible response wrapper |

### ⚠️ Framework Considerations

#### Next.js API Routes

Next.js uses different response objects than Express:

| Router | Compatible | Reason |
|--------|------------|--------|
| Pages Router (`/pages/api/*`) | ❌ No | Uses `NextApiResponse` |
| App Router (`/app/api/*`) | ❌ No | Uses `NextResponse` |

**Workaround**: If you're using Next.js, you can create a simple adapter or use Express.js as a custom server.

#### React, Vue, Angular (Frontend)

This library is **NOT for frontend use**. It standardizes API responses on your **backend server**. Your frontend applications consume these standardized JSON responses via `fetch`, `axios`, or similar HTTP clients.

```
┌─────────────────────────────┐              ┌─────────────────────────────┐
│         FRONTEND            │    HTTP      │          BACKEND            │
│  React / Vue / Angular /    │   Request    │    Express.js Server        │
│  Next.js / Nuxt / etc.      │ ──────────►  │                             │
│                             │              │  ┌───────────────────────┐  │
│  • Consumes JSON responses  │  ◄────────── │  │ @aryanjsx/api-response│  │
│  • Does NOT use this lib    │    JSON      │  │ (formats responses)   │  │
│                             │   Response   │  └───────────────────────┘  │
└─────────────────────────────┘              └─────────────────────────────┘
```

### Frontend Response Handling Example

Your frontend receives standardized responses and can handle them consistently:

```typescript
// React/Next.js frontend example
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  if (data.success) {
    // TypeScript knows the shape: { success, statusCode, message, data, meta }
    return data.data; // The actual user object
  } else {
    // Error response: { success, statusCode, message, code?, errors?, meta }
    throw new Error(data.message);
  }
}
```

## Features

- 🎯 **Type-safe**: Full TypeScript support with exported types
- 🪶 **Lightweight**: Zero runtime dependencies
- 🔌 **Express-first**: Designed for Express.js and compatible frameworks
- 📦 **Modern ESM**: ES Modules with full tree-shaking support
- 🛡️ **Production-ready**: Global error handling with environment awareness
- ✅ **Well-tested**: 100% test coverage

## Installation

```bash
npm install @aryanjsx/api-response
```

```bash
yarn add @aryanjsx/api-response
```

```bash
pnpm add @aryanjsx/api-response
```

## Quick Start

### TypeScript

```typescript
import express, { Request, Response } from 'express';
import {
  success,
  error,
  validationError,
  paginated,
  AppError,
  globalErrorHandler,
  type ValidationErrorItem,
} from '@aryanjsx/api-response';

const app = express();
app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
}

// Success response with type inference
app.get('/api/users/:id', (req: Request, res: Response) => {
  const user: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
  success<User>(res, user, 'User retrieved successfully');
});

// Error response
app.get('/api/protected', (req: Request, res: Response) => {
  error(res, 'Authentication required', 401);
});

// Validation error with typed errors
app.post('/api/users', (req: Request, res: Response) => {
  const errors: ValidationErrorItem[] = [
    { field: 'email', message: 'Email is required' },
    { field: 'password', message: 'Password must be at least 8 characters' },
  ];
  validationError(res, errors);
});

// Paginated response with generics
app.get('/api/users', (req: Request, res: Response) => {
  const users: User[] = [/* array of users */];
  paginated<User>(res, users, { page: 1, limit: 10, total: 100 });
});

// Throwing typed errors (caught by globalErrorHandler)
app.get('/api/resource', () => {
  throw new AppError('User not found', 404, 'USER_NOT_FOUND');
});

// Register global error handler last
app.use(globalErrorHandler());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### JavaScript

```javascript
import express from 'express';
import {
  success,
  error,
  validationError,
  paginated,
  AppError,
  globalErrorHandler
} from '@aryanjsx/api-response';

const app = express();
app.use(express.json());

// Success response
app.get('/api/users/:id', (req, res) => {
  const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
  success(res, user, 'User retrieved successfully');
});

// Error response
app.get('/api/protected', (req, res) => {
  error(res, 'Authentication required', 401);
});

// Validation error
app.post('/api/users', (req, res) => {
  const errors = [
    { field: 'email', message: 'Email is required' },
    { field: 'password', message: 'Password must be at least 8 characters' }
  ];
  validationError(res, errors);
});

// Paginated response
app.get('/api/users', (req, res) => {
  const users = [/* array of users */];
  paginated(res, users, { page: 1, limit: 10, total: 100 });
});

// Throwing errors (caught by globalErrorHandler)
app.get('/api/resource', () => {
  throw new AppError('User not found', 404, 'USER_NOT_FOUND');
});

// Register global error handler last
app.use(globalErrorHandler());

app.listen(3000);
```

## API Reference

### `success<T>(res, data, message?, statusCode?, meta?)`

Sends a standardized success response.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `res` | `ApiResponse` | - | Express response object |
| `data` | `T` | - | Response payload |
| `message` | `string` | `'Success'` | Success message |
| `statusCode` | `number` | `200` | HTTP status code |
| `meta` | `Record<string, unknown>` | `{}` | Additional metadata |

**Example:**

```typescript
// Basic
success(res, { id: 1 });

// With message and status
success(res, { id: 1 }, 'User created', 201);

// With metadata
success(res, { id: 1 }, 'Success', 200, { version: 'v1' });

// With type parameter
success<User>(res, user, 'User retrieved');
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { "id": 1 },
  "meta": { "timestamp": "2024-01-15T10:30:00.000Z" }
}
```

---

### `error(res, message?, statusCode?, errors?, meta?)`

Sends a standardized error response.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `res` | `ApiResponse` | - | Express response object |
| `message` | `string` | `'An error occurred'` | Error message |
| `statusCode` | `number` | `500` | HTTP status code |
| `errors` | `ValidationErrorItem[] \| Record<string, unknown> \| null` | `null` | Detailed error info |
| `meta` | `Record<string, unknown>` | `{}` | Additional metadata |

**Example:**

```typescript
// Basic
error(res, 'Something went wrong');

// Not found
error(res, 'User not found', 404);

// With error details
error(res, 'Request failed', 400, [
  { field: 'id', message: 'Invalid ID format' }
]);
```

**Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "meta": { "timestamp": "2024-01-15T10:30:00.000Z" }
}
```

---

### `validationError(res, errors)`

Sends a validation error response with HTTP 422 status.

| Parameter | Type | Description |
|-----------|------|-------------|
| `res` | `ApiResponse` | Express response object |
| `errors` | `ValidationErrorItem[]` | Array of validation errors |

**Example:**

```typescript
const errors: ValidationErrorItem[] = [
  { field: 'email', message: 'Invalid email format' },
  { field: 'age', message: 'Age must be a positive number' }
];
validationError(res, errors);
```

**Response:**

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "age", "message": "Age must be a positive number" }
  ],
  "meta": { "timestamp": "2024-01-15T10:30:00.000Z" }
}
```

---

### `paginated<T>(res, data, pagination, message?)`

Sends a paginated response with pagination metadata.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `res` | `ApiResponse` | - | Express response object |
| `data` | `T[]` | - | Array of items |
| `pagination` | `PaginationInput` | - | Pagination details |
| `pagination.page` | `number` | - | Current page (1-indexed) |
| `pagination.limit` | `number` | - | Items per page |
| `pagination.total` | `number` | - | Total item count |
| `message` | `string` | `'Success'` | Success message |

**Example:**

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = await Product.find().skip(0).limit(10);
const total = await Product.countDocuments();

paginated<Product>(res, products, { page: 1, limit: 10, total: 95 });
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 95,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "meta": { "timestamp": "2024-01-15T10:30:00.000Z" }
}
```

---

### `AppError` Class

Custom error class for application errors. Works with `globalErrorHandler`.

```typescript
// Constructor
new AppError(message: string, statusCode?: number, code?: string)

// Static factory methods
AppError.badRequest(message: string, code?: string)     // 400
AppError.unauthorized(message?: string, code?: string)  // 401
AppError.forbidden(message?: string, code?: string)     // 403
AppError.notFound(message?: string, code?: string)      // 404
AppError.conflict(message: string, code?: string)       // 409
AppError.internal(message?: string, code?: string)      // 500
```

**Example:**

```typescript
// Using constructor
throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');

// Using factory methods
throw AppError.notFound('User not found', 'USER_NOT_FOUND');
throw AppError.unauthorized();
throw AppError.badRequest('Invalid input');
```

**Properties:**

```typescript
class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly isOperational: boolean;
}
```

---

### `globalErrorHandler()`

Express middleware that catches all errors and returns standardized responses.

**Features:**
- Handles `AppError` instances with proper status codes
- Catches unexpected errors gracefully
- Hides internal error details in production (`NODE_ENV=production`)
- Includes stack traces in development
- Attaches `requestId` if available on `req.requestId` or `x-request-id` header

**Example:**

```typescript
import { globalErrorHandler, AppError } from '@aryanjsx/api-response';

// Your routes
app.get('/api/resource', () => {
  throw AppError.notFound('Resource not found');
});

// Register last, after all routes
app.use(globalErrorHandler());
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "code": "NOT_FOUND",
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "abc-123"
  }
}
```

## TypeScript Types

All types are exported for use in your application:

```typescript
import type {
  // Response types
  ApiResponse,
  ApiRequest,
  ApiNextFunction,
  ResponseMeta,
  BaseResponse,
  SuccessResponse,
  ErrorResponse,
  ValidationErrorItem,
  ValidationErrorResponse,
  PaginationInput,
  PaginationOutput,
  PaginatedResponse,
  ErrorHandlerMiddleware,
} from '@aryanjsx/api-response';
```

### Type Definitions

```typescript
interface ValidationErrorItem {
  field: string;
  message: string;
  [key: string]: unknown;
}

interface PaginationInput {
  page: number;
  limit: number;
  total: number;
}

interface PaginationOutput extends PaginationInput {
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface SuccessResponse<T = unknown> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta: ResponseMeta;
}

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: ValidationErrorItem[] | Record<string, unknown>;
  code?: string;
  meta: ResponseMeta;
}

interface PaginatedResponse<T = unknown> {
  success: true;
  statusCode: 200;
  message: string;
  data: T[];
  pagination: PaginationOutput;
  meta: ResponseMeta;
}
```

## Integration Examples

### With express-validator

```typescript
import { validationResult } from 'express-validator';
import { validationError, type ValidationErrorItem } from '@aryanjsx/api-response';
import type { Request, Response, NextFunction } from 'express';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted: ValidationErrorItem[] = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
    }));
    return validationError(res, formatted);
  }
  next();
};
```

### With async/await

```typescript
import { success, AppError } from '@aryanjsx/api-response';
import type { Request, Response, NextFunction } from 'express';

app.get('/api/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }
    success(res, user);
  } catch (err) {
    next(err); // Passes to globalErrorHandler
  }
});
```

### With express-async-handler

```typescript
import asyncHandler from 'express-async-handler';
import { success, AppError } from '@aryanjsx/api-response';
import type { Request, Response } from 'express';

app.get('/api/users/:id', asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  success(res, user);
}));
```

### With MongoDB/Mongoose

```typescript
import { success, paginated, AppError } from '@aryanjsx/api-response';
import User from './models/User';

// Get single document
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  success(res, user);
}));

// Get paginated list
app.get('/api/users', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments()
  ]);

  paginated(res, users, { page, limit, total });
}));
```

## Roadmap

- [x] TypeScript support with full type definitions
- [x] Express.js support
- [x] Global error handler middleware
- [x] Pagination helpers
- [ ] Next.js API route adapters
- [ ] Fastify adapter
- [ ] Koa adapter
- [ ] OpenAPI/Swagger schema generation
- [ ] Response compression utilities
- [ ] HATEOAS link helpers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © aryanjsx
