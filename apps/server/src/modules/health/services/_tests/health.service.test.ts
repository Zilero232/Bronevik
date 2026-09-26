import type { HealthCheckResult } from '@nestjs/terminus';

import { ServiceUnavailableException } from '@nestjs/common';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { HEALTH } from '../../config';
import { CollectorStateIndicator, RedisIndicator } from '../../indicators';
import { HealthService } from '../health.service';

const healthy: HealthCheckResult = {
  status: 'ok',
  info: { [HEALTH.key.database]: { status: 'up' } },
  error: {},
  details: { [HEALTH.key.database]: { status: 'up' } }
};

const failing: HealthCheckResult = {
  status: 'error',
  info: {},
  error: { [HEALTH.key.redis]: { status: 'down', message: 'ECONNREFUSED' } },
  details: { [HEALTH.key.redis]: { status: 'down', message: 'ECONNREFUSED' } }
};

const createHealth = () => {
  const health = mock<HealthCheckService>();
  const prismaIndicator = mock<PrismaHealthIndicator>();
  const redis = mock<RedisIndicator>();
  const collector = mock<CollectorStateIndicator>();

  const prisma = mockDeep<PrismaService>();

  return { health, prismaIndicator, prisma, redis, collector, service: new HealthService(health, prismaIndicator, prisma, redis, collector) };
};

describe('HealthService.check', () => {
  it('checks the database, Redis, the worker heartbeat and the Lesta circuit', async () => {
    const { health, prismaIndicator, prisma, redis, collector, service } = createHealth();

    health.check.mockImplementation(async (indicators) => {
      await Promise.all(indicators.map((indicator) => (typeof indicator === 'function' ? indicator() : indicator)));

      return healthy;
    });

    expect(await service.check()).toMatchObject({ status: 'ok' });
    expect(prismaIndicator.pingCheck).toHaveBeenCalledWith(HEALTH.key.database, prisma);
    expect(redis.ping).toHaveBeenCalledOnce();
    expect(collector.worker).toHaveBeenCalledOnce();
    expect(collector.lestaCircuit).toHaveBeenCalledOnce();
  });

  it('returns the failed report instead of throwing when a dependency is down', async () => {
    const { health, service } = createHealth();

    health.check.mockRejectedValue(new ServiceUnavailableException(failing));

    expect(await service.check()).toMatchObject({ status: 'error', details: { [HEALTH.key.redis]: { status: 'down' } } });
  });

  it('rethrows an unexpected failure of the health check itself', async () => {
    const { health, service } = createHealth();

    health.check.mockRejectedValue(new Error('boom'));

    await expect(service.check()).rejects.toThrow('boom');
  });
});
