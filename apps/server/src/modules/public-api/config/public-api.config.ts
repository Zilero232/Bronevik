export const PUBLIC_API = {
  tagPrefix: 'v1-'
} as const;

export const API_RATE_LIMIT = {
  secondPrefix: 'bronevik:api:rps',
  secondWindow: 1,
  headers: {
    limit: 'X-RateLimit-Limit',
    remaining: 'X-RateLimit-Remaining',
    dailyLimit: 'X-RateLimit-Daily-Limit',
    dailyRemaining: 'X-RateLimit-Daily-Remaining',
    retryAfter: 'Retry-After'
  }
} as const;

export const API_USAGE = {
  flushIntervalMs: 10_000,
  errorMessageMaxLength: 500,
  unmatchedEndpoint: 'unmatched'
} as const;
