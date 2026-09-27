import type { BetterAuthOptions } from 'better-auth';
import type { Redis } from 'ioredis';

export type RateLimitRules = NonNullable<NonNullable<BetterAuthOptions['rateLimit']>['customRules']>;

export type RateLimitStorage = NonNullable<NonNullable<BetterAuthOptions['rateLimit']>['customStorage']>;

export type RedisRateLimitInput = {
  redis: Pick<Redis, 'multi'>;
};
