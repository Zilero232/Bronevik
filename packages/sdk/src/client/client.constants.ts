import type { RetryOptions } from 'ky';

export const BRONEVIK_API = {
  baseUrl: 'https://api.bronevik.app',
  apiKeyHeader: 'X-API-Key'
} as const;

export const BRONEVIK_RETRY = {
  limit: 3,
  statusCodes: [408, 425, 429, 500, 502, 503, 504],
  afterStatusCodes: [413, 429, 503],
  maxRetryAfter: 60_000,
  backoffLimit: 10_000
} as const satisfies RetryOptions;
