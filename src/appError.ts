/**
 * @fileoverview Custom application error class
 * Extends native Error to include HTTP status codes and error codes
 */

/**
 * Custom error class for application-specific errors
 * Designed to work seamlessly with the globalErrorHandler middleware
 *
 * @example
 * // Throw a not found error
 * throw new AppError('User not found', 404, 'USER_NOT_FOUND');
 *
 * @example
 * // Throw an unauthorized error
 * throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  /**
   * Creates an instance of AppError
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code (default: 500)
   * @param code - Machine-readable error code (default: 'INTERNAL_ERROR')
   */
  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR'
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Creates an AppError for bad request (400)
   * @param message - Error message
   * @param code - Error code (default: 'BAD_REQUEST')
   */
  static badRequest(message: string, code: string = 'BAD_REQUEST'): AppError {
    return new AppError(message, 400, code);
  }

  /**
   * Creates an AppError for unauthorized (401)
   * @param message - Error message (default: 'Unauthorized')
   * @param code - Error code (default: 'UNAUTHORIZED')
   */
  static unauthorized(
    message: string = 'Unauthorized',
    code: string = 'UNAUTHORIZED'
  ): AppError {
    return new AppError(message, 401, code);
  }

  /**
   * Creates an AppError for forbidden (403)
   * @param message - Error message (default: 'Forbidden')
   * @param code - Error code (default: 'FORBIDDEN')
   */
  static forbidden(
    message: string = 'Forbidden',
    code: string = 'FORBIDDEN'
  ): AppError {
    return new AppError(message, 403, code);
  }

  /**
   * Creates an AppError for not found (404)
   * @param message - Error message (default: 'Resource not found')
   * @param code - Error code (default: 'NOT_FOUND')
   */
  static notFound(
    message: string = 'Resource not found',
    code: string = 'NOT_FOUND'
  ): AppError {
    return new AppError(message, 404, code);
  }

  /**
   * Creates an AppError for conflict (409)
   * @param message - Error message
   * @param code - Error code (default: 'CONFLICT')
   */
  static conflict(message: string, code: string = 'CONFLICT'): AppError {
    return new AppError(message, 409, code);
  }

  /**
   * Creates an AppError for internal server error (500)
   * @param message - Error message (default: 'Internal server error')
   * @param code - Error code (default: 'INTERNAL_ERROR')
   */
  static internal(
    message: string = 'Internal server error',
    code: string = 'INTERNAL_ERROR'
  ): AppError {
    return new AppError(message, 500, code);
  }
}
