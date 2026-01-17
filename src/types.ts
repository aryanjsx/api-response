/**
 * @fileoverview Type definitions for @aryanjsx/api-response
 * These types are framework-agnostic but designed to be compatible with Express
 */

/**
 * Express Response type - using a minimal interface for framework-agnostic support
 * Compatible with Express, Koa adapters, and similar frameworks
 */
export interface ApiResponse {
  status(code: number): this;
  json(body: unknown): this;
}

/**
 * Express Request type - minimal interface for framework-agnostic support
 */
export interface ApiRequest {
  requestId?: string;
  headers: Record<string, string | string[] | undefined>;
}

/**
 * Express NextFunction type
 */
export type ApiNextFunction = (err?: unknown) => void;

/**
 * Metadata object included in all responses
 */
export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  [key: string]: unknown;
}

/**
 * Base response structure shared by all response types
 */
export interface BaseResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: ResponseMeta;
}

/**
 * Success response structure
 */
export interface SuccessResponse<T = unknown> extends BaseResponse {
  success: true;
  data: T;
}

/**
 * Error response structure
 */
export interface ErrorResponse extends BaseResponse {
  success: false;
  errors?: ValidationErrorItem[] | Record<string, unknown> | unknown[];
  code?: string;
  stack?: string;
}

/**
 * Validation error item structure
 */
export interface ValidationErrorItem {
  field: string;
  message: string;
  [key: string]: unknown;
}

/**
 * Validation error response structure
 */
export interface ValidationErrorResponse extends BaseResponse {
  success: false;
  statusCode: 422;
  message: 'Validation failed';
  errors: ValidationErrorItem[];
}

/**
 * Pagination input parameters
 */
export interface PaginationInput {
  page: number;
  limit: number;
  total: number;
}

/**
 * Pagination output in response
 */
export interface PaginationOutput extends PaginationInput {
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T = unknown> extends BaseResponse {
  success: true;
  statusCode: 200;
  data: T[];
  pagination: PaginationOutput;
}

/**
 * Express error handler middleware type
 */
export type ErrorHandlerMiddleware = (
  err: Error,
  req: ApiRequest,
  res: ApiResponse,
  next: ApiNextFunction
) => ApiResponse | void;

/**
 * Express compatibility types
 * These are placeholder types that match Express signatures
 * Use these when you don't have @types/express installed
 */
export type ExpressResponse = ApiResponse;
export type ExpressRequest = ApiRequest;
export type ExpressNextFunction = ApiNextFunction;
