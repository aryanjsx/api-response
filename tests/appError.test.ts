/**
 * @fileoverview Tests for AppError class
 */

import { AppError } from '../src/appError.js';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create error with all parameters', () => {
      const error = new AppError('Test error', 404, 'TEST_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
    });

    it('should use default status code 500', () => {
      const error = new AppError('Test error');

      expect(error.statusCode).toBe(500);
    });

    it('should use default code INTERNAL_ERROR', () => {
      const error = new AppError('Test error');

      expect(error.code).toBe('INTERNAL_ERROR');
    });

    it('should be instance of Error', () => {
      const error = new AppError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should have stack trace', () => {
      const error = new AppError('Test error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('AppError');
    });
  });

  describe('static factory methods', () => {
    describe('badRequest', () => {
      it('should create 400 error', () => {
        const error = AppError.badRequest('Invalid input');

        expect(error.statusCode).toBe(400);
        expect(error.code).toBe('BAD_REQUEST');
        expect(error.message).toBe('Invalid input');
      });

      it('should accept custom code', () => {
        const error = AppError.badRequest('Invalid input', 'INVALID_FORMAT');

        expect(error.code).toBe('INVALID_FORMAT');
      });
    });

    describe('unauthorized', () => {
      it('should create 401 error with defaults', () => {
        const error = AppError.unauthorized();

        expect(error.statusCode).toBe(401);
        expect(error.code).toBe('UNAUTHORIZED');
        expect(error.message).toBe('Unauthorized');
      });

      it('should accept custom message and code', () => {
        const error = AppError.unauthorized('Invalid token', 'TOKEN_EXPIRED');

        expect(error.message).toBe('Invalid token');
        expect(error.code).toBe('TOKEN_EXPIRED');
      });
    });

    describe('forbidden', () => {
      it('should create 403 error with defaults', () => {
        const error = AppError.forbidden();

        expect(error.statusCode).toBe(403);
        expect(error.code).toBe('FORBIDDEN');
        expect(error.message).toBe('Forbidden');
      });

      it('should accept custom message and code', () => {
        const error = AppError.forbidden('Access denied', 'NO_PERMISSION');

        expect(error.message).toBe('Access denied');
        expect(error.code).toBe('NO_PERMISSION');
      });
    });

    describe('notFound', () => {
      it('should create 404 error with defaults', () => {
        const error = AppError.notFound();

        expect(error.statusCode).toBe(404);
        expect(error.code).toBe('NOT_FOUND');
        expect(error.message).toBe('Resource not found');
      });

      it('should accept custom message and code', () => {
        const error = AppError.notFound('User not found', 'USER_NOT_FOUND');

        expect(error.message).toBe('User not found');
        expect(error.code).toBe('USER_NOT_FOUND');
      });
    });

    describe('conflict', () => {
      it('should create 409 error', () => {
        const error = AppError.conflict('Email already exists');

        expect(error.statusCode).toBe(409);
        expect(error.code).toBe('CONFLICT');
        expect(error.message).toBe('Email already exists');
      });

      it('should accept custom code', () => {
        const error = AppError.conflict('Duplicate entry', 'DUPLICATE_EMAIL');

        expect(error.code).toBe('DUPLICATE_EMAIL');
      });
    });

    describe('internal', () => {
      it('should create 500 error with defaults', () => {
        const error = AppError.internal();

        expect(error.statusCode).toBe(500);
        expect(error.code).toBe('INTERNAL_ERROR');
        expect(error.message).toBe('Internal server error');
      });

      it('should accept custom message and code', () => {
        const error = AppError.internal('Database connection failed', 'DB_ERROR');

        expect(error.message).toBe('Database connection failed');
        expect(error.code).toBe('DB_ERROR');
      });
    });
  });
});
