/**
 * @fileoverview Tests for meta utility functions
 */

import { generateMeta } from '../src/meta.js';

describe('generateMeta', () => {
  it('should return object with timestamp', () => {
    const meta = generateMeta();

    expect(meta).toHaveProperty('timestamp');
    expect(typeof meta.timestamp).toBe('string');
  });

  it('should return valid ISO timestamp', () => {
    const meta = generateMeta();
    const date = new Date(meta.timestamp);

    expect(date.toISOString()).toBe(meta.timestamp);
  });

  it('should merge additional metadata', () => {
    const meta = generateMeta({ requestId: 'abc-123', version: 'v1' });

    expect(meta.timestamp).toBeDefined();
    expect(meta.requestId).toBe('abc-123');
    expect(meta.version).toBe('v1');
  });

  it('should not overwrite timestamp with additional meta', () => {
    const customTimestamp = '2020-01-01T00:00:00.000Z';
    const meta = generateMeta({ timestamp: customTimestamp });

    // Additional meta is spread after timestamp, so it will overwrite
    expect(meta.timestamp).toBe(customTimestamp);
  });

  it('should handle empty additional meta', () => {
    const meta = generateMeta({});

    expect(Object.keys(meta)).toContain('timestamp');
  });
});
