export const RATE_LIMIT = {
  windowSeconds: 1,
  redisKeyPrefix: 'lesta:rl',
  redisKey: 'global'
} as const;
