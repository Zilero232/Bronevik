import type { ApiTier } from '@otmetki/schemas';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { API_TIER_LIMITS } from '@otmetki/schemas';
import { millisecondsInSecond } from 'date-fns/constants';
import { Redis } from 'ioredis';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';

import type { AuthenticatedApiKey } from '../../developer';
import type { SecondBudget } from '../public-api.types';

import { AppTooManyRequestsException } from '../../../common/exceptions';
import { errorMessage } from '../../../common/lib';
import { REDIS } from '../../../core';
import { API_RATE_LIMIT } from '../config';

@Injectable()
export class ApiRateLimitService {
  private readonly logger = new Logger(ApiRateLimitService.name);
  private readonly limiters = new Map<ApiTier, RateLimiterRedis>();

  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async consume(key: Pick<AuthenticatedApiKey, 'id' | 'tier'>): Promise<SecondBudget> {
    const limit = API_TIER_LIMITS[key.tier].requestsPerSecond;

    try {
      const { remainingPoints } = await this.limiter(key.tier).consume(key.id);

      return { limit, remaining: remainingPoints };
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        throw new AppTooManyRequestsException(
          'RATE_LIMITED',
          `Up to ${limit} requests per second on the ${key.tier} tier`,
          Math.max(1, Math.ceil(error.msBeforeNext / millisecondsInSecond))
        );
      }

      this.logger.warn(`rate limit store unavailable, letting the request through: ${errorMessage(error)}`);

      return { limit, remaining: limit };
    }
  }

  private limiter(tier: ApiTier): RateLimiterRedis {
    const existing = this.limiters.get(tier);

    if (existing) {
      return existing;
    }

    const limiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: `${API_RATE_LIMIT.secondPrefix}:${tier}`,
      points: API_TIER_LIMITS[tier].requestsPerSecond,
      duration: API_RATE_LIMIT.secondWindow
    });

    this.limiters.set(tier, limiter);

    return limiter;
  }
}
