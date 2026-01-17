/**
 * @fileoverview Error response helper and global error handler
 * Provides standardized error response formatting for Express applications
 */

import { generateMeta } from './meta.js';
import { AppError } from './appError.js';
import type {
  ApiResponse,
  ApiRequest,
  ApiNextFunction,
  ErrorResponse,
  ErrorHandlerMiddleware,
  ValidationErrorItem,
} from './types.js';

/**
 * Sends a standardized error response
 *
 * @param res - Express response object
 * @param message - Error message (default: 'An error occurred')
 * @param statusCode - HTTP status code (default: 500)
 * @param errors - Detailed error information
 * @param meta - Additional metadata to include
 * @returns Express response
 *
 * @example
 * // Basic error response
 * error(res, 'Something went wrong');
 *
 * @example
 * // Not found error
 * error(res, 'User not found', 404);
 *
 * @example
 * // Error with details
 * error(res, 'Validation failed', 400, [{ field: 'email', message: 'Invalid email' }]);
 */
export function error(
  res: ApiResponse,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors: ValidationErrorItem[] | Record<string, unknown> | null = null,
  meta: Record<string, unknown> = {}
): ApiResponse {
  const response: ErrorResponse = {
    success: false,
    statusCode,
    message,
    meta: generateMeta(meta),
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

/**
 * Express middleware for global error handling
 * Catches all errors thrown in the application and returns standardized responses
 *
 * @returns Express error handling middleware
 *
 * @example
 * // Register as the last middleware in your Express app
 * import { globalErrorHandler } from '@aryanjsx/api-response';
 *
 * app.use(globalErrorHandler());
 */
export function globalErrorHandler(): ErrorHandlerMiddleware {
  return (
    err: Error,
    req: ApiRequest,
    res: ApiResponse,
    _next: ApiNextFunction
  ): ApiResponse => {
    // Extract requestId if available (commonly set by request logging middleware)
    const requestId =
      req.requestId ||
      (typeof req.headers['x-request-id'] === 'string'
        ? req.headers['x-request-id']
        : null);

    // Build meta object with requestId if available
    const meta: Record<string, unknown> = requestId ? { requestId } : {};

    // Handle known AppError instances
    if (err instanceof AppError) {
      const response: ErrorResponse = {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        code: err.code,
        meta: generateMeta(meta),
      };

      return res.status(err.statusCode).json(response);
    }

    // Handle unknown/unexpected errors
    // In production, hide internal error details
    const isProduction = process.env.NODE_ENV === 'production';
    const statusCode = (err as AppError).statusCode || 500;
    const message =
      isProduction && statusCode === 500
        ? 'Internal server error'
        : err.message || 'An unexpected error occurred';

    const response: ErrorResponse = {
      success: false,
      statusCode,
      message,
      code: 'INTERNAL_ERROR',
      meta: generateMeta(meta),
    };

    // Include stack trace in development for debugging
    if (!isProduction && err.stack) {
      response.stack = err.stack;
    }

    return res.status(statusCode).json(response);
  };
}
