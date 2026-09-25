import type { Redis } from 'ioredis';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { CollectorState } from '../../../../generated';
import type { PrismaService } from '../../../core';

import { HEALTH } from '../config';
import { HealthService } from '../services';

const state = (value: unknown) => mock<CollectorState>({ value: JSON.parse(JSON.stringify(value)) });

type StoredStates = {
  heartbeat?: unknown;
  circuit?: unknown;
};

const createHealth = ({ heartbeat, circuit }: StoredStates) => {
  const prisma = mockDeep<PrismaService>();
  const redis = mock<Redis>();

  prisma.$queryRaw.mockResolvedValue([]);
  redis.ping.mockResolvedValue('PONG');

  prisma.collectorState.findUnique
    .mockResolvedValueOnce(heartbeat === undefined ? null : state(heartbeat))
    .mockResolvedValueOnce(circuit === undefined ? null : state(circuit));

  return new HealthService(prisma, redis);
};

describe('HealthService', () => {
  it('reports a fresh worker heartbeat and the stored circuit state', async () => {
    const health = createHealth({ heartbeat: { collectedAt: new Date().toISOString() }, circuit: { state: 'open' } });

    expect(await health.check()).toMatchObject({ status: 'ok', worker: 'ok', lestaCircuit: 'open' });
  });

  it('calls a heartbeat older than the window stale', async () => {
    const health = createHealth({ heartbeat: { collectedAt: new Date(Date.now() - HEALTH.workerStaleMs - 1).toISOString() } });

    expect((await health.check()).worker).toBe('stale');
  });

  it('knows nothing about a worker that never reported', async () => {
    expect(await createHealth({}).check()).toMatchObject({ worker: 'unknown', lestaCircuit: 'unknown' });
  });
});
