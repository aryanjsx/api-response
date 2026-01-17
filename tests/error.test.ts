/**
 * @fileoverview Tests for error response function and globalErrorHandler
 */

import { jest } from '@jest/globals';
import { error, globalErrorHandler } from '../src/error.js';
import { AppError } from '../src/appError.js';
import { createMockResponse, createMockRequest, getResponseData } from './mocks.js';
import type { ErrorResponse } from '../src/types.js';

describe('error', () => {
  it('should send error response with defaults', () => {
    const res = createMockResponse();

    error(res);

    const { status, body } = getResponseData<ErrorResponse>(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.statusCode).toBe(500);
    expect(body.message).toBe('An error occurred');
    expect(body.meta.timestamp).toBeDefined();
  });

  it('should accept custom message', () => {
    const res = createMockResponse();

    error(res, 'Something went wrong');

    const { body } = getResponseData<ErrorResponse>(res);

    expect(body.message).toBe('Something went wrong');
  });

  it('should accept custom status code', () => {
    const res = createMockResponse();

    error(res, 'Not found', 404);

    const { status, body } = getResponseData<ErrorResponse>(res);

    expect(status).toBe(404);
    expect(body.statusCode).toBe(404);
  });

  it('should include errors array', () => {
    const res = createMockResponse();
    const errors = [{ field: 'email', message: 'Invalid' }];

    error(res, 'Validation failed', 400, errors);

    const { body } = getResponseData<ErrorResponse>(res);

    expect(body.errors).toEqual(errors);
  });

  it('should include errors object', () => {
    const res = createMockResponse();
    const errors = { email: 'Invalid format' };

    error(res, 'Validation failed', 400, errors);

    const { body } = getResponseData<ErrorResponse>(res);

    expect(body.errors).toEqual(errors);
  });

  it('should not include errors when null', () => {
    const res = createMockResponse();

    error(res, 'Error', 500, null);

    const { body } = getResponseData<ErrorResponse>(res);

    expect(body).not.toHaveProperty('errors');
  });

  it('should include additional metadata', () => {
    const res = createMockResponse();

    error(res, 'Error', 500, null, { requestId: 'abc-123' });

    const { body } = getResponseData<ErrorResponse>(res);

    expect(body.meta.requestId).toBe('abc-123');
  });

  it('should return the response object', () => {
    const res = createMockResponse();

    const result = error(res, 'Error');

    expect(result).toBe(res);
  });
});

describe('globalErrorHandler', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should return a middleware function', () => {
    const handler = globalErrorHandler();

    expect(typeof handler).toBe('function');
    expect(handler.length).toBe(4); // Express error handlers have 4 params
  });

  describe('handling AppError', () => {
    it('should handle AppError with correct status and code', () => {
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest();
      const err = new AppError('User not found', 404, 'USER_NOT_FOUND');
      const next = jest.fn();

      handler(err, req, res, next);

      const { status, body } = getResponseData<ErrorResponse>(res);

      expect(status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(404);
      expect(body.message).toBe('User not found');
      expect(body.code).toBe('USER_NOT_FOUND');
    });

    it('should include requestId from request object', () => {
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest({ requestId: 'req-123' });
      const err = new AppError('Error', 400, 'ERROR');
      const next = jest.fn();

      handler(err, req, res, next);

      const { body } = getResponseData<ErrorResponse>(res);

      expect(body.meta.requestId).toBe('req-123');
    });

    it('should include requestId from x-request-id header', () => {
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest({
        headers: { 'x-request-id': 'header-123' },
      });
      const err = new AppError('Error', 400, 'ERROR');
      const next = jest.fn();

      handler(err, req, res, next);

      const { body } = getResponseData<ErrorResponse>(res);

      expect(body.meta.requestId).toBe('header-123');
    });

    it('should prefer requestId from request over header', () => {
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest({
        requestId: 'req-123',
        headers: { 'x-request-id': 'header-123' },
      });
      const err = new AppError('Error', 400, 'ERROR');
      const next = jest.fn();

      handler(err, req, res, next);

      const { body } = getResponseData<ErrorResponse>(res);

      expect(body.meta.requestId).toBe('req-123');
    });
  });

  describe('handling unknown errors', () => {
    it('should handle generic Error', () => {
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest();
      const err = new Error('Something broke');
      const next = jest.fn();

      handler(err, req, res, next);

      const { status, body } = getResponseData<ErrorResponse>(res);

      expect(status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.code).toBe('INTERNAL_ERROR');
    });

    it('should show error message in development', () => {
      process.env.NODE_ENV = 'development';
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest();
      const err = new Error('Detailed error message');
      const next = jest.fn();

      handler(err, req, res, next);

      const { body } = getResponseData<ErrorResponse>(res);

      expect(body.message).toBe('Detailed error message');
      expect(body.stack).toBeDefined();
    });

    it('should hide error message in production', () => {
      process.env.NODE_ENV = 'production';
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest();
      const err = new Error('Sensitive error details');
      const next = jest.fn();

      handler(err, req, res, next);

      const { body } = getResponseData<ErrorResponse>(res);

      expect(body.message).toBe('Internal server error');
      expect(body.stack).toBeUndefined();
    });

    it('should preserve non-500 status codes in production', () => {
      process.env.NODE_ENV = 'production';
      const handler = globalErrorHandler();
      const res = createMockResponse();
      const req = createMockRequest();
      const err = new Error('Not found') as Error & { statusCode: number };
      err.statusCode = 404;
      const next = jest.fn();

      handler(err, req, res, next);

      const { status, body } = getResponseData<ErrorResponse>(res);

      expect(status).toBe(404);
      expect(body.message).toBe('Not found');
    });
  });

  it('should return the response object', () => {
    const handler = globalErrorHandler();
    const res = createMockResponse();
    const req = createMockRequest();
    const err = new AppError('Error', 400, 'ERROR');
    const next = jest.fn();

    const result = handler(err, req, res, next);

    expect(result).toBe(res);
  });
});
