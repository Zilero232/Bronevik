export const REDIS = Symbol('REDIS');

export const REDIS_OPTIONS = {
  maxRetriesPerRequest: 3,
  connectTimeoutMs: 5_000
} as const;
