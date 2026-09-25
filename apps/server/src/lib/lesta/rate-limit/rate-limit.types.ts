import type { Redis } from 'ioredis';
import type { RateLimiterQueue } from 'rate-limiter-flexible';

export type RateLimiter = {
  acquire: () => Promise<void>;
};

export type MemoryRateLimiterInput = {
  requestsPerSecond?: number;
  maxQueueSize?: number;
};

export type RedisRateLimiterInput = {
  redis: Redis;
  key?: string;
  keyPrefix?: string;
  requestsPerSecond?: number;
  maxQueueSize?: number;
};

export type QueueRateLimiterInput = {
  queue: RateLimiterQueue;
  key: string;
};
