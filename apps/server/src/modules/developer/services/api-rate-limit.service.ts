import type { ApiPlan } from '@bronevik/schemas';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';

import type { AuthenticatedApiKey, LimiterInput, RateLimitState, RejectInput } from '../developer.types';

import { AppTooManyRequestsException } from '../../../common/exceptions';
import { REDIS } from '../../../core';
import { API_PLANS, API_RATE_LIMIT } from '../config';
import { usageDay } from '../lib';

@Injectable()
export class ApiRateLimitService {
  private readonly logger = new Logger(ApiRateLimitService.name);
  private readonly perSecond = new Map<ApiPlan, RateLimiterRedis>();
  private readonly perDay = new Map<ApiPlan, RateLimiterRedis>();

  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async consume(key: AuthenticatedApiKey): Promise<RateLimitState> {
    const limits = API_PLANS[key.plan];
    const state: RateLimitState = { limit: limits.requestsPerSecond, remaining: 0, dailyLimit: limits.requestsPerDay, dailyRemaining: 0 };

    try {
      const second = await this.limiter({ plan: key.plan, window: 'second' }).consume(key.id);

      state.remaining = second.remainingPoints;
    } catch (error) {
      this.reject({ error, code: 'RATE_LIMITED', message: `Up to ${limits.requestsPerSecond} requests per second on the ${key.plan} plan` });
      state.remaining = limits.requestsPerSecond;
    }

    try {
      const day = await this.limiter({ plan: key.plan, window: 'day' }).consume(`${key.id}:${usageDay(new Date())}`);

      state.dailyRemaining = day.remainingPoints;
    } catch (error) {
      this.reject({ error, code: 'PLAN_LIMIT_REACHED', message: `The daily quota of ${limits.requestsPerDay} requests is used up` });
      state.dailyRemaining = limits.requestsPerDay;
    }

    return state;
  }

  private reject({ error, code, message }: RejectInput): void {
    if (error instanceof RateLimiterRes) {
      throw new AppTooManyRequestsException(code, message, Math.max(1, Math.ceil(error.msBeforeNext / 1000)));
    }

    this.logger.warn(`rate limit store unavailable, letting the request through: ${error instanceof Error ? error.message : String(error)}`);
  }

  private limiter({ plan, window }: LimiterInput): RateLimiterRedis {
    const cache = window === 'second' ? this.perSecond : this.perDay;
    const existing = cache.get(plan);

    if (existing) {
      return existing;
    }

    const limits = API_PLANS[plan];

    const limiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: `${window === 'second' ? API_RATE_LIMIT.secondPrefix : API_RATE_LIMIT.dayPrefix}:${plan}`,
      points: window === 'second' ? limits.requestsPerSecond : limits.requestsPerDay,
      duration: window === 'second' ? API_RATE_LIMIT.secondWindow : API_RATE_LIMIT.dayWindow
    });

    cache.set(plan, limiter);

    return limiter;
  }
}
