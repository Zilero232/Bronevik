import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';

import type { RateLimiter } from '../rate-limit.types';

import { createMemoryRateLimiter, createRedisRateLimiter } from '../rate-limiters';

const PENDING = Symbol('pending');

const PENDING_WINDOW_MS = 50;

const settledQuickly = async (promise: Promise<void>) =>
  Promise.race([promise, new Promise<typeof PENDING>((resolve) => setTimeout(resolve, PENDING_WINDOW_MS, PENDING))]);

const expectThrottled = async (limiter: RateLimiter) => {
  const startedAt = Date.now();

  await limiter.acquire();
  await limiter.acquire();

  const third = limiter.acquire();

  expect(await settledQuickly(third)).toBe(PENDING);

  await third;

  expect(Date.now() - startedAt).toBeGreaterThanOrEqual(500);
};

describe('rate limiters', () => {
  it('memory limiter queues requests beyond the per-second budget', async () => {
    await expectThrottled(createMemoryRateLimiter({ requestsPerSecond: 2 }));
  });

  it('redis limiter shares one budget between clients on the same key', async () => {
    const redis = new RedisMock();
    const key = `shared-${Date.now()}`;
    const instanceA = createRedisRateLimiter({ redis, key, requestsPerSecond: 2 });
    const instanceB = createRedisRateLimiter({ redis, key, requestsPerSecond: 2 });

    await instanceA.acquire();
    await instanceB.acquire();

    const third = instanceA.acquire();

    expect(await settledQuickly(third)).toBe(PENDING);

    await third;
  });
});
