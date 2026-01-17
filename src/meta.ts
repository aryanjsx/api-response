/**
 * @fileoverview Meta utilities for API responses
 * Provides timestamp and metadata generation for consistent response formatting
 */

import type { ResponseMeta } from './types.js';

/**
 * Generates metadata object with current timestamp
 * @param additionalMeta - Additional metadata to merge
 * @returns Meta object containing timestamp and any additional properties
 */
export function generateMeta(additionalMeta: Record<string, unknown> = {}): ResponseMeta {
  return {
    timestamp: new Date().toISOString(),
    ...additionalMeta,
  };
}
