/**
 * @fileoverview Validation error response helper
 * Provides standardized validation error formatting for Express applications
 */

import { generateMeta } from './meta.js';
import type {
  ApiResponse,
  ValidationErrorResponse,
  ValidationErrorItem,
} from './types.js';

/**
 * Sends a standardized validation error response (HTTP 422)
 *
 * @param res - Express response object
 * @param errors - Array of validation errors
 * @returns Express response
 *
 * @example
 * // Single validation error
 * validationError(res, [
 *   { field: 'email', message: 'Email is required' }
 * ]);
 *
 * @example
 * // Multiple validation errors
 * validationError(res, [
 *   { field: 'email', message: 'Invalid email format' },
 *   { field: 'password', message: 'Password must be at least 8 characters' }
 * ]);
 *
 * @example
 * // Integration with express-validator
 * import { validationResult } from 'express-validator';
 *
 * const errors = validationResult(req);
 * if (!errors.isEmpty()) {
 *   const formattedErrors = errors.array().map(err => ({
 *     field: err.path,
 *     message: err.msg
 *   }));
 *   return validationError(res, formattedErrors);
 * }
 */
export function validationError(
  res: ApiResponse,
  errors: ValidationErrorItem[]
): ApiResponse {
  const response: ValidationErrorResponse = {
    success: false,
    statusCode: 422,
    message: 'Validation failed',
    errors,
    meta: generateMeta(),
  };

  return res.status(422).json(response);
}
