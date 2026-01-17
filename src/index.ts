/**
 * @fileoverview Main entry point for @aryanjsx/api-response
 * A lightweight, dependency-free library for standardizing REST API responses
 *
 * @module @aryanjsx/api-response
 * @version 1.0.0
 * @license MIT
 */

// Response helpers
export { success } from './success.js';
export { error, globalErrorHandler } from './error.js';
export { validationError } from './validation.js';
export { paginated } from './paginate.js';

// Error class
export { AppError } from './appError.js';

// Utilities
export { generateMeta } from './meta.js';

// Type exports
export type {
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
  // Express type aliases
  ExpressResponse,
  ExpressRequest,
  ExpressNextFunction,
} from './types.js';
