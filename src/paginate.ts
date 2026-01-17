/**
 * @fileoverview Paginated response helper
 * Provides standardized pagination response formatting for Express applications
 */

import { generateMeta } from './meta.js';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationInput,
  PaginationOutput,
} from './types.js';

/**
 * Sends a standardized paginated response
 *
 * @typeParam T - Type of items in the data array
 * @param res - Express response object
 * @param data - Array of items for the current page
 * @param pagination - Pagination details
 * @param pagination.page - Current page number (1-indexed)
 * @param pagination.limit - Number of items per page
 * @param pagination.total - Total number of items across all pages
 * @param message - Success message (default: 'Success')
 * @returns Express response
 *
 * @example
 * // Basic paginated response
 * paginated(res, users, { page: 1, limit: 10, total: 100 });
 *
 * @example
 * // Paginated response with custom message
 * paginated(res, products, { page: 2, limit: 20, total: 150 }, 'Products retrieved');
 *
 * @example
 * // Complete pagination example with database query
 * const page = parseInt(req.query.page as string) || 1;
 * const limit = parseInt(req.query.limit as string) || 10;
 * const skip = (page - 1) * limit;
 *
 * const users = await User.find().skip(skip).limit(limit);
 * const total = await User.countDocuments();
 *
 * paginated(res, users, { page, limit, total });
 */
export function paginated<T>(
  res: ApiResponse,
  data: T[],
  pagination: PaginationInput,
  message: string = 'Success'
): ApiResponse {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);

  const paginationOutput: PaginationOutput = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  const response: PaginatedResponse<T> = {
    success: true,
    statusCode: 200,
    message,
    data,
    pagination: paginationOutput,
    meta: generateMeta(),
  };

  return res.status(200).json(response);
}
