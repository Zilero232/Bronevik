import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';

import { AppTooManyRequestsException } from '../../../../common/exceptions';
import { API_PLANS } from '../../config';
import { ApiRateLimitService } from '../api-rate-limit.service';

const key = (id: string) => ({ id, userId: 'user', plan: 'free' as const });

describe('ApiRateLimitService.consume', () => {
  it('lets a plan use its requests per second and throttles the next one', async () => {
    const service = new ApiRateLimitService(new RedisMock());
    const { requestsPerSecond } = API_PLANS.free;

    for (let request = 0; request < requestsPerSecond; request += 1) {
      await service.consume(key('rps'));
    }

    const error = await service.consume(key('rps')).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(AppTooManyRequestsException);
    expect(error).toMatchObject({ response: { code: 'RATE_LIMITED' } });
    expect(error instanceof AppTooManyRequestsException ? error.retryAfterSec : null).toBeGreaterThan(0);
  });

  it('reports what is left of both budgets', async () => {
    const service = new ApiRateLimitService(new RedisMock());

    const state = await service.consume(key('budget'));

    expect(state.limit).toBe(API_PLANS.free.requestsPerSecond);
    expect(state.remaining).toBe(API_PLANS.free.requestsPerSecond - 1);
    expect(state.dailyRemaining).toBe(API_PLANS.free.requestsPerDay - 1);
  });

  it('counts every key on its own', async () => {
    const service = new ApiRateLimitService(new RedisMock());

    for (let request = 0; request < API_PLANS.free.requestsPerSecond; request += 1) {
      await service.consume(key('busy'));
    }

    await expect(service.consume(key('quiet'))).resolves.toMatchObject({ remaining: API_PLANS.free.requestsPerSecond - 1 });
  });
});
