/**
 * @fileoverview Tests for paginated response function
 */

import { paginated } from '../src/paginate.js';
import { createMockResponse, getResponseData } from './mocks.js';
import type { PaginatedResponse } from '../src/types.js';

interface TestItem {
  id: number;
  name: string;
}

describe('paginated', () => {
  it('should send paginated response', () => {
    const res = createMockResponse();
    const data: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    paginated(res, data, { page: 1, limit: 10, total: 50 });

    const { status, body } = getResponseData<PaginatedResponse<TestItem>>(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe('Success');
    expect(body.data).toEqual(data);
    expect(body.meta.timestamp).toBeDefined();
  });

  it('should calculate pagination correctly', () => {
    const res = createMockResponse();

    paginated(res, [], { page: 2, limit: 10, total: 95 });

    const { body } = getResponseData<PaginatedResponse>(res);

    expect(body.pagination.page).toBe(2);
    expect(body.pagination.limit).toBe(10);
    expect(body.pagination.total).toBe(95);
    expect(body.pagination.totalPages).toBe(10); // Math.ceil(95/10)
    expect(body.pagination.hasNextPage).toBe(true);
    expect(body.pagination.hasPrevPage).toBe(true);
  });

  it('should set hasNextPage to false on last page', () => {
    const res = createMockResponse();

    paginated(res, [], { page: 5, limit: 10, total: 50 });

    const { body } = getResponseData<PaginatedResponse>(res);

    expect(body.pagination.hasNextPage).toBe(false);
    expect(body.pagination.hasPrevPage).toBe(true);
  });

  it('should set hasPrevPage to false on first page', () => {
    const res = createMockResponse();

    paginated(res, [], { page: 1, limit: 10, total: 50 });

    const { body } = getResponseData<PaginatedResponse>(res);

    expect(body.pagination.hasNextPage).toBe(true);
    expect(body.pagination.hasPrevPage).toBe(false);
  });

  it('should handle single page result', () => {
    const res = createMockResponse();

    paginated(res, [], { page: 1, limit: 10, total: 5 });

    const { body } = getResponseData<PaginatedResponse>(res);

    expect(body.pagination.totalPages).toBe(1);
    expect(body.pagination.hasNextPage).toBe(false);
    expect(body.pagination.hasPrevPage).toBe(false);
  });

  it('should handle empty result', () => {
    const res = createMockResponse();

    paginated(res, [], { page: 1, limit: 10, total: 0 });

    const { body } = getResponseData<PaginatedResponse>(res);

    expect(body.data).toEqual([]);
    expect(body.pagination.totalPages).toBe(0);
    expect(body.pagination.hasNextPage).toBe(false);
    expect(body.pagination.hasPrevPage).toBe(false);
  });

  it('should accept custom message', () => {
    const res = createMockResponse();

    paginated(res, [], { page: 1, limit: 10, total: 0 }, 'Users retrieved');

    const { body } = getResponseData<PaginatedResponse>(res);

    expect(body.message).toBe('Users retrieved');
  });

  it('should handle exact page boundary', () => {
    const res = createMockResponse();

    paginated(res, [], { page: 10, limit: 10, total: 100 });

    const { body } = getResponseData<PaginatedResponse>(res);

    expect(body.pagination.totalPages).toBe(10);
    expect(body.pagination.hasNextPage).toBe(false);
    expect(body.pagination.hasPrevPage).toBe(true);
  });

  it('should return the response object', () => {
    const res = createMockResponse();

    const result = paginated(res, [], { page: 1, limit: 10, total: 0 });

    expect(result).toBe(res);
  });
});
