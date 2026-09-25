import type { INestApplication } from '@nestjs/common';

import { API_KEY } from '@bronevik/schemas';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import RedisMock from 'ioredis-mock';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { AppUnauthorizedException } from '../../../common/exceptions';
import { AllExceptionsFilter } from '../../../common/filters';
import { REDIS } from '../../../core';
import { LeaderboardService } from '../../leaderboards';
import { API_PLANS, API_RATE_LIMIT } from '../config';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ApiUsageInterceptor } from '../interceptors/api-usage.interceptor';
import { ApiKeysService, ApiRateLimitService, ApiUsageService } from '../services';
import { V1LeaderboardsController } from '../v1-leaderboards.controller';

const VALID_KEY = 'brv_valid';
const leaderboard = { scope: 'players', metric: 'wn8', period: '30d', total: 0, minBattles: 50, entries: [] };

const keys = mock<ApiKeysService>();
const usage = mock<ApiUsageService>();
const leaderboards = mock<LeaderboardService>();

keys.authenticate.mockImplementation(async (raw) => {
  if (raw !== VALID_KEY) {
    throw new AppUnauthorizedException('API_KEY_INVALID', 'The API key is not valid');
  }

  return { id: 'key', userId: 'user', plan: 'free' };
});

leaderboards.leaderboard.mockResolvedValue({ ...leaderboard, scope: 'players', metric: 'wn8', period: '30d' });

describe('/v1 behind the API key guard', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [V1LeaderboardsController],
      providers: [
        ApiKeyGuard,
        ApiUsageInterceptor,
        ApiRateLimitService,
        { provide: REDIS, useValue: new RedisMock() },
        { provide: ApiKeysService, useValue: keys },
        { provide: ApiUsageService, useValue: usage },
        { provide: LeaderboardService, useValue: leaderboards },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_PIPE, useClass: ZodValidationPipe },
        { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('answers 401 without a key', async () => {
    const response = await request(app.getHttpServer()).get('/v1/leaderboards');

    expect(response.status).toBe(401);
    expect(response.body.code).toBe('API_KEY_INVALID');
    expect(leaderboards.leaderboard).not.toHaveBeenCalled();
  });

  it('answers 401 for an unknown key', async () => {
    const response = await request(app.getHttpServer()).get('/v1/leaderboards').set(API_KEY.header, 'brv_other');

    expect(response.status).toBe(401);
  });

  it('serves a valid key and reports the remaining budget', async () => {
    const response = await request(app.getHttpServer()).get('/v1/leaderboards').set(API_KEY.header, VALID_KEY);

    expect(response.status).toBe(200);
    expect(response.body.minBattles).toBe(leaderboard.minBattles);
    expect(Number(response.headers[API_RATE_LIMIT.headers.limit.toLowerCase()])).toBe(API_PLANS.free.requestsPerSecond);
    expect(usage.record).toHaveBeenCalledWith(expect.objectContaining({ keyId: 'key', endpoint: 'GET /v1/leaderboards', failed: false }));
  });

  it('throttles past the plan rate with 429 and Retry-After', async () => {
    const statuses: number[] = [];
    let throttled: request.Response | null = null;

    for (let attempt = 0; attempt <= API_PLANS.free.requestsPerSecond; attempt += 1) {
      const response = await request(app.getHttpServer()).get('/v1/leaderboards?limit=5').set(API_KEY.header, VALID_KEY);

      statuses.push(response.status);

      if (response.status === 429) {
        throttled = response;
      }
    }

    expect(statuses).toContain(429);
    expect(throttled?.body.code).toBe('RATE_LIMITED');
    expect(Number(throttled?.headers['retry-after'])).toBeGreaterThan(0);
    expect(usage.recordThrottled).toHaveBeenCalled();
  });
});
