/**
 * @fileoverview Tests for success response function
 */

import { success } from '../src/success.js';
import { createMockResponse, getResponseData } from './mocks.js';
import type { SuccessResponse } from '../src/types.js';

describe('success', () => {
  it('should send success response with data', () => {
    const res = createMockResponse();
    const data = { id: 1, name: 'John' };

    success(res, data);

    const { status, body } = getResponseData<SuccessResponse<typeof data>>(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe('Success');
    expect(body.data).toEqual(data);
    expect(body.meta.timestamp).toBeDefined();
  });

  it('should accept custom message', () => {
    const res = createMockResponse();

    success(res, { id: 1 }, 'User created successfully');

    const { body } = getResponseData<SuccessResponse>(res);

    expect(body.message).toBe('User created successfully');
  });

  it('should accept custom status code', () => {
    const res = createMockResponse();

    success(res, { id: 1 }, 'Created', 201);

    const { status, body } = getResponseData<SuccessResponse>(res);

    expect(status).toBe(201);
    expect(body.statusCode).toBe(201);
  });

  it('should include additional metadata', () => {
    const res = createMockResponse();

    success(res, { id: 1 }, 'Success', 200, { version: 'v1', requestId: 'abc' });

    const { body } = getResponseData<SuccessResponse>(res);

    expect(body.meta.version).toBe('v1');
    expect(body.meta.requestId).toBe('abc');
    expect(body.meta.timestamp).toBeDefined();
  });

  it('should handle null data', () => {
    const res = createMockResponse();

    success(res, null);

    const { body } = getResponseData<SuccessResponse<null>>(res);

    expect(body.success).toBe(true);
    expect(body.data).toBeNull();
  });

  it('should handle array data', () => {
    const res = createMockResponse();
    const data = [{ id: 1 }, { id: 2 }];

    success(res, data);

    const { body } = getResponseData<SuccessResponse<typeof data>>(res);

    expect(body.data).toHaveLength(2);
    expect(body.data).toEqual(data);
  });

  it('should handle primitive data', () => {
    const res = createMockResponse();

    success(res, 'simple string');

    const { body } = getResponseData<SuccessResponse<string>>(res);

    expect(body.data).toBe('simple string');
  });

  it('should return the response object', () => {
    const res = createMockResponse();

    const result = success(res, { id: 1 });

    expect(result).toBe(res);
  });
});
