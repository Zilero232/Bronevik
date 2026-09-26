export const MODERATION = {
  roles: ['admin', 'moderator'],
  reportThrottle: { limit: 10, ttl: 60_000 },
  pageLimit: 100
} as const;
