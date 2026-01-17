/**
 * @fileoverview Success response helper
 * Provides standardized success response formatting for Express applications
 */

import { generateMeta } from './meta.js';
import type { ApiResponse, SuccessResponse, ResponseMeta } from './types.js';

/**
 * Sends a standardized success response
 *
 * @typeParam T - Type of the response data
 * @param res - Express response object
 * @param data - Response payload data
 * @param message - Success message (default: 'Success')
 * @param statusCode - HTTP status code (default: 200)
 * @param meta - Additional metadata to include
 * @returns Express response
 *
 * @example
 * // Basic success response
 * success(res, { user: { id: 1, name: 'John' } });
 *
 * @example
 * // Success with custom message and status
 * success(res, { id: 1 }, 'User created successfully', 201);
 *
 * @example
 * // Success with additional metadata
 * success(res, data, 'Success', 200, { version: '1.0' });
 */
export function success<T>(
  res: ApiResponse,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  meta: Record<string, unknown> = {}
): ApiResponse {
  const response: SuccessResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
    meta: generateMeta(meta) as ResponseMeta,
  };

  return res.status(statusCode).json(response);
}
