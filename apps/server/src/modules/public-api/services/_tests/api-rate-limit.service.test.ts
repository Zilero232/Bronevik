import { API_TIER_LIMITS } from '@otmetki/schemas';
import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';

import { AppTooManyRequestsException } from '../../../../common/exceptions';
import { API_RATE_LIMIT } from '../../config';
import { ApiRateLimitService } from '../api-rate-limit.service';

const owner = (userId: string) => ({ userId, tier: 'free' as const });

describe('ApiRateLimitService.consume', () => {
  it('lets a tier use its requests per second and throttles the next one', async () => {
    const service = new ApiRateLimitService(new RedisMock());
    const { requestsPerSecond } = API_TIER_LIMITS.free;

    for (let request = 0; request < requestsPerSecond; request += 1) {
      await service.consume(owner('rps'));
    }

    const error = await service.consume(owner('rps')).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(AppTooManyRequestsException);
    expect(error).toMatchObject({ response: { code: 'RATE_LIMITED' } });
    expect(error instanceof AppTooManyRequestsException ? error.retryAfterSec : null).toBeGreaterThan(0);
  });

  it('reports what is left of the per-second and the daily budget', async () => {
    const service = new ApiRateLimitService(new RedisMock());

    await expect(service.consume(owner('budget'))).resolves.toEqual({
      second: { limit: API_TIER_LIMITS.free.requestsPerSecond, remaining: API_TIER_LIMITS.free.requestsPerSecond - 1 },
      day: { limit: API_TIER_LIMITS.free.requestsPerDay, remaining: API_TIER_LIMITS.free.requestsPerDay - 1 }
    });
  });

  it('counts every user on its own', async () => {
    const service = new ApiRateLimitService(new RedisMock());

    for (let request = 0; request < API_TIER_LIMITS.free.requestsPerSecond; request += 1) {
      await service.consume(owner('busy'));
    }

    await expect(service.consume(owner('quiet'))).resolves.toMatchObject({ second: { remaining: API_TIER_LIMITS.free.requestsPerSecond - 1 } });
  });

  it('stops a user whose keys together used up the daily quota', async () => {
    const redis = new RedisMock();
    const service = new ApiRateLimitService(redis);

    await redis.set(`${API_RATE_LIMIT.dayPrefix}:heavy`, API_TIER_LIMITS.free.requestsPerDay, 'EX', API_RATE_LIMIT.dayWindow);

    await expect(service.consume(owner('heavy'))).rejects.toMatchObject({ response: { code: 'PLAN_LIMIT_REACHED' } });
  });
});
