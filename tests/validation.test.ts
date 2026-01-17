/**
 * @fileoverview Tests for validationError function
 */

import { validationError } from '../src/validation.js';
import { createMockResponse, getResponseData } from './mocks.js';
import type { ValidationErrorResponse, ValidationErrorItem } from '../src/types.js';

describe('validationError', () => {
  it('should send validation error response', () => {
    const res = createMockResponse();
    const errors: ValidationErrorItem[] = [
      { field: 'email', message: 'Email is required' },
    ];

    validationError(res, errors);

    const { status, body } = getResponseData<ValidationErrorResponse>(res);

    expect(status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.statusCode).toBe(422);
    expect(body.message).toBe('Validation failed');
    expect(body.errors).toEqual(errors);
    expect(body.meta.timestamp).toBeDefined();
  });

  it('should handle multiple validation errors', () => {
    const res = createMockResponse();
    const errors: ValidationErrorItem[] = [
      { field: 'email', message: 'Email is required' },
      { field: 'password', message: 'Password must be at least 8 characters' },
      { field: 'age', message: 'Age must be a positive number' },
    ];

    validationError(res, errors);

    const { body } = getResponseData<ValidationErrorResponse>(res);

    expect(body.errors).toHaveLength(3);
    expect(body.errors[0].field).toBe('email');
    expect(body.errors[1].field).toBe('password');
    expect(body.errors[2].field).toBe('age');
  });

  it('should handle empty errors array', () => {
    const res = createMockResponse();

    validationError(res, []);

    const { status, body } = getResponseData<ValidationErrorResponse>(res);

    expect(status).toBe(422);
    expect(body.errors).toEqual([]);
  });

  it('should preserve additional error properties', () => {
    const res = createMockResponse();
    const errors: ValidationErrorItem[] = [
      {
        field: 'email',
        message: 'Invalid format',
        value: 'not-an-email',
        constraint: 'isEmail',
      },
    ];

    validationError(res, errors);

    const { body } = getResponseData<ValidationErrorResponse>(res);

    expect(body.errors[0].value).toBe('not-an-email');
    expect(body.errors[0].constraint).toBe('isEmail');
  });

  it('should return the response object', () => {
    const res = createMockResponse();

    const result = validationError(res, [{ field: 'test', message: 'error' }]);

    expect(result).toBe(res);
  });
});
