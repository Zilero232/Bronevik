export const SESSION_SHARE = {
  preferenceThrottle: { limit: 10, ttl: 60_000 },
  sendThrottle: { limit: 6, ttl: 60_000 },
  autoJobPrefix: 'auto'
} as const;
