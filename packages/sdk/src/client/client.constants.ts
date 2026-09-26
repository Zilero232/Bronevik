import type { RetryOptions } from 'ky';

export const OTMETKI_API = {
  baseUrl: 'https://api.triotmetki.ru',
  apiKeyHeader: 'X-API-Key'
} as const;

export const OTMETKI_RETRY = {
  limit: 3,
  statusCodes: [408, 425, 429, 500, 502, 503, 504],
  afterStatusCodes: [413, 429, 503],
  maxRetryAfter: 60_000,
  backoffLimit: 10_000
} as const satisfies RetryOptions;
