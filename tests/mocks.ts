/**
 * @fileoverview Test utilities and mocks for Express response objects
 */

import type { ApiResponse, ApiRequest } from '../src/types.js';

/**
 * Creates a mock Express response object for testing
 */
export function createMockResponse(): ApiResponse & {
  _status: number;
  _json: unknown;
} {
  const res = {
    _status: 0,
    _json: null as unknown,
    status(code: number) {
      this._status = code;
      return this;
    },
    json(body: unknown) {
      this._json = body;
      return this;
    },
  };
  return res;
}

/**
 * Creates a mock Express request object for testing
 */
export function createMockRequest(overrides: Partial<ApiRequest> = {}): ApiRequest {
  return {
    headers: {},
    ...overrides,
  };
}

/**
 * Helper to extract response data from mock response
 */
export function getResponseData<T>(res: ReturnType<typeof createMockResponse>): {
  status: number;
  body: T;
} {
  return {
    status: res._status,
    body: res._json as T,
  };
}
