import type { RateLimitRules, RateLimitStorage, RedisRateLimitInput } from './rate-limit.types';

import { AUTH_RATE_LIMIT } from '../auth.constants';

export const authRateLimitRules = (): RateLimitRules =>
  Object.fromEntries([
    ...AUTH_RATE_LIMIT.callbackPaths.map((path) => [path, AUTH_RATE_LIMIT.callback] as const),
    ...AUTH_RATE_LIMIT.signInPaths.map((path) => [path, AUTH_RATE_LIMIT.signIn] as const)
  ]);

export const redisRateLimit = ({ redis }: RedisRateLimitInput): RateLimitStorage => ({
  consume: async (key, { window, max }) => {
    const redisKey = `${AUTH_RATE_LIMIT.prefix}${key}`;
    const replies = await redis.multi().set(redisKey, 0, 'EX', window, 'NX').incr(redisKey).pttl(redisKey).exec();
    const count = Number(replies?.[1]?.[1] ?? 0);
    const ttlMs = Number(replies?.[2]?.[1] ?? 0);

    if (count <= max) {
      return { allowed: true, retryAfter: null };
    }

    return { allowed: false, retryAfter: Math.max(1, Math.ceil(ttlMs / 1000)) };
  }
});
