export const RATE_LIMIT = {
  serverRequestsPerSecond: 20,
  standaloneRequestsPerSecond: 10,
  windowSeconds: 1,
  redisKeyPrefix: 'lesta:rl',
  redisKey: 'global'
} as const;
