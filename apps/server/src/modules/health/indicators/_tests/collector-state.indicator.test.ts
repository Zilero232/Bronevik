import { HealthIndicatorService } from '@nestjs/terminus';
import { subMilliseconds } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { CollectorState } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { HEALTH } from '../../config';
import { CollectorStateIndicator } from '../collector-state.indicator';

const state = (value: unknown) => mock<CollectorState>({ value: JSON.parse(JSON.stringify(value)) });

const createIndicator = (value?: unknown) => {
  const prisma = mockDeep<PrismaService>();

  prisma.collectorState.findUnique.mockResolvedValue(value === undefined ? null : state(value));

  return new CollectorStateIndicator(prisma, new HealthIndicatorService());
};

describe('CollectorStateIndicator.worker', () => {
  it('is up when the heartbeat is fresh', async () => {
    const result = await createIndicator({ collectedAt: new Date().toISOString() }).worker();

    expect(result[HEALTH.key.worker]).toMatchObject({ status: 'up', state: 'ok' });
  });

  it('is degraded when the heartbeat is older than the window', async () => {
    const collectedAt = subMilliseconds(new Date(), HEALTH.workerStaleMs + 1).toISOString();
    const result = await createIndicator({ collectedAt }).worker();

    expect(result[HEALTH.key.worker]).toMatchObject({ status: 'degraded', state: 'stale' });
  });

  it('is degraded and unknown when the worker never reported', async () => {
    const result = await createIndicator().worker();

    expect(result[HEALTH.key.worker]).toMatchObject({ status: 'degraded', state: 'unknown' });
  });
});

describe('CollectorStateIndicator.lestaCircuit', () => {
  it('is up while the circuit is closed', async () => {
    const result = await createIndicator({ state: 'closed' }).lestaCircuit();

    expect(result[HEALTH.key.lestaCircuit]).toMatchObject({ status: 'up', state: 'closed' });
  });

  it('is degraded while the circuit is open', async () => {
    const result = await createIndicator({ state: 'open' }).lestaCircuit();

    expect(result[HEALTH.key.lestaCircuit]).toMatchObject({ status: 'degraded', state: 'open' });
  });

  it('is degraded and unknown without a stored state', async () => {
    const result = await createIndicator().lestaCircuit();

    expect(result[HEALTH.key.lestaCircuit]).toMatchObject({ status: 'degraded', state: 'unknown' });
  });
});
