import type { Redis } from 'ioredis';
import type { RateLimiterQueue } from 'rate-limiter-flexible';

export type RateLimiter = {
  acquire: () => Promise<void>;
};

export type RedisRateLimiterInput = {
  redis: Redis;
  requestsPerSecond: number;
  key?: string;
  keyPrefix?: string;
  maxQueueSize?: number;
};

export type QueueRateLimiterInput = {
  queue: RateLimiterQueue;
  key: string;
};
