export const CACHE_TTL = {
  short: 30_000,
  player: 120_000,
  server: 600_000,
  reference: 3_600_000
} as const;

export const CACHE_STORE = {
  namespace: 'bronevik:api:cache'
} as const;

export const THROTTLE = {
  name: 'default',
  ttl: 60_000,
  limit: 120
} as const;
