import { RateLimiterMemory, RateLimiterQueue, RateLimiterRedis } from 'rate-limiter-flexible';

import type { MemoryRateLimiterInput, QueueRateLimiterInput, RateLimiter, RedisRateLimiterInput } from './rate-limit.types';

import { RATE_LIMIT } from './rate-limit.constants';

const fromQueue = ({ queue, key }: QueueRateLimiterInput): RateLimiter => ({
  acquire: async () => {
    await queue.removeTokens(1, key);
  }
});

export const createMemoryRateLimiter = ({
  requestsPerSecond = RATE_LIMIT.serverRequestsPerSecond,
  maxQueueSize
}: MemoryRateLimiterInput = {}): RateLimiter => {
  const limiter = new RateLimiterMemory({ points: requestsPerSecond, duration: RATE_LIMIT.windowSeconds });

  return fromQueue({ queue: new RateLimiterQueue(limiter, { maxQueueSize }), key: RATE_LIMIT.redisKey });
};

export const createRedisRateLimiter = ({
  redis,
  key = RATE_LIMIT.redisKey,
  keyPrefix = RATE_LIMIT.redisKeyPrefix,
  requestsPerSecond = RATE_LIMIT.serverRequestsPerSecond,
  maxQueueSize
}: RedisRateLimiterInput): RateLimiter => {
  const limiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points: requestsPerSecond,
    duration: RATE_LIMIT.windowSeconds
  });

  return fromQueue({ queue: new RateLimiterQueue(limiter, { maxQueueSize }), key });
};

export const noopRateLimiter: RateLimiter = {
  acquire: async () => {}
};
