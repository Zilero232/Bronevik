export const USAGE_METER = {
  keyPrefix: 'otmetki:usage',
  dedupeSeconds: 86_400,
  expirySlackSeconds: 86_400,
  anonymousIpFactor: 3
} as const;

export const USAGE_ROUTE = {
  cacheControl: 'private, no-store'
} as const;
