import { API_PLAN_LIMITS } from '@otmetki/schemas';
import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';

import { AppTooManyRequestsException } from '../../../../common/exceptions';
import { ApiRateLimitService } from '../api-rate-limit.service';

const key = (id: string) => ({ id, plan: 'free' as const });

describe('ApiRateLimitService.consume', () => {
  it('lets a plan use its requests per second and throttles the next one', async () => {
    const service = new ApiRateLimitService(new RedisMock());
    const { requestsPerSecond } = API_PLAN_LIMITS.free;

    for (let request = 0; request < requestsPerSecond; request += 1) {
      await service.consume(key('rps'));
    }

    const error = await service.consume(key('rps')).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(AppTooManyRequestsException);
    expect(error).toMatchObject({ response: { code: 'RATE_LIMITED' } });
    expect(error instanceof AppTooManyRequestsException ? error.retryAfterSec : null).toBeGreaterThan(0);
  });

  it('reports what is left of the per-second budget', async () => {
    const service = new ApiRateLimitService(new RedisMock());

    await expect(service.consume(key('budget'))).resolves.toEqual({
      limit: API_PLAN_LIMITS.free.requestsPerSecond,
      remaining: API_PLAN_LIMITS.free.requestsPerSecond - 1
    });
  });

  it('counts every key on its own', async () => {
    const service = new ApiRateLimitService(new RedisMock());

    for (let request = 0; request < API_PLAN_LIMITS.free.requestsPerSecond; request += 1) {
      await service.consume(key('busy'));
    }

    await expect(service.consume(key('quiet'))).resolves.toMatchObject({ remaining: API_PLAN_LIMITS.free.requestsPerSecond - 1 });
  });
});
