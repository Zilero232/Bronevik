import type { INestApplication } from '@nestjs/common';

import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AllExceptionsFilter } from '../../../common/filters';
import { INDEX } from '../lib/select-release/_tests/fixtures';
import { ModpackReleasesController } from '../modpack-releases.controller';
import { ModpackReleasesService, ReleaseIndexService } from '../services';

describe('modpack releases API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ModpackReleasesController],
      providers: [
        ModpackReleasesService,
        { provide: ReleaseIndexService, useValue: { load: async () => INDEX } },
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

  it('answers GET /modpack/releases/latest with the compatible release and its package hashes', async () => {
    const response = await request(app.getHttpServer()).get('/modpack/releases/latest').query({ game: '1.46.0.0' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('compatible');
    expect(response.body.release.version).toBe('0.10.0');
    expect(response.body.release.packages[0].sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it('tells the manager to wait for a client no release supports', async () => {
    const response = await request(app.getHttpServer()).get('/modpack/releases/latest').query({ game: '1.99.0.0' });

    expect(response.body).toEqual({ game: '1.99.0.0', status: 'waiting', release: null });
  });

  it('rejects a malformed game version before the service', async () => {
    const response = await request(app.getHttpServer()).get('/modpack/releases/latest').query({ game: 'latest' });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_FAILED');
  });

  it('serves the Tauri updater payload for an older manager', async () => {
    const response = await request(app.getHttpServer()).get('/modpack/manager/update').query({ target: 'windows', arch: 'x86_64', current: '0.1.0' });

    expect(response.status).toBe(200);
    expect(response.body.version).toBe('0.2.0');
    expect(response.body.signature).toBeTruthy();
  });

  it('answers 204 when the manager is current', async () => {
    const response = await request(app.getHttpServer()).get('/modpack/manager/update').query({ target: 'windows', arch: 'x86_64', current: '0.2.0' });

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });
});
