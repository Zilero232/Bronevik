import type { INestApplication } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AppNotFoundException } from '../../../common/exceptions';
import { AllExceptionsFilter } from '../../../common/filters';
import { MoePublicController } from '../moe-public.controller';
import { MoeTableService } from '../services';

const KNOWN_TANK = 17_953;
const thresholds = { '65': 2_000, '85': 2_600, '95': 3_100 };

const table = {
  forMod: async (tankId: number) => {
    if (tankId !== KNOWN_TANK) {
      throw new AppNotFoundException('NOT_FOUND', 'no thresholds');
    }

    return { tank_id: tankId, thresholds, updated_at: '2026-09-24T00:00:00.000Z', source: 'poliroid' };
  }
};

describe('GET /v1/moe/:tankId', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [MoePublicController],
      providers: [
        { provide: MoeTableService, useValue: table },
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

  it('returns the thresholds in the shape the mod reads', async () => {
    const response = await request(app.getHttpServer()).get(`/v1/moe/${KNOWN_TANK}`);

    expect(response.status).toBe(200);
    expect(response.body.tank_id).toBe(KNOWN_TANK);
    expect(response.body.thresholds).toEqual(thresholds);
  });

  it('answers 404 with the shared error shape when there is no data', async () => {
    const response = await request(app.getHttpServer()).get('/v1/moe/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'no thresholds', code: 'NOT_FOUND' });
  });

  it('rejects a malformed tank id before reaching the service', async () => {
    const response = await request(app.getHttpServer()).get('/v1/moe/not-a-tank');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_FAILED');
  });
});
