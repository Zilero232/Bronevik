export const LINK_CODE = {
  length: 8,
  alphabet: 'ABCDEFGHJKMNPQRSTUVWXYZ23456789',
  ttlMinutes: 15
} as const;

export const WEB_LOGIN = {
  bytes: 32,
  ttlMinutes: 10,
  path: '/login/telegram',
  throttle: { ttl: 60_000, limit: 10 }
} as const;
