import type { Health } from '@otmetki/schemas';

import { COLLECTOR_JOBS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { summarizeHealth } from '../health-summary';

const REPORT: Omit<Health, 'details' | 'status'> = {
  collector: {
    jobs: COLLECTOR_JOBS.map((job) => ({ job, lastSuccessAt: null, version: null })),
    queues: [],
    queuesCollectedAt: null,
    lastModBattleAt: null
  },
  build: { version: '0.1.0', commit: null }
};

const HEALTHY: Health = {
  ...REPORT,
  status: 'ok',
  details: {
    database: { status: 'up' },
    redis: { status: 'up' },
    worker: { status: 'up', state: 'ok', collectedAt: '2026-09-29T10:00:00.000Z' },
    lestaCircuit: { status: 'up', state: 'closed' }
  }
};

const noteOf = (health: Health, key: string) =>
  summarizeHealth({ health, isError: false }).components.find((component) => component.key === key)?.note;

describe('summarizeHealth', () => {
  it('calls a fully healthy API ok', () => {
    expect(summarizeHealth({ health: HEALTHY, isError: false })).toMatchObject({ verdict: 'ok', status: 'ok' });
  });

  it('tells an unreachable API apart from one still loading', () => {
    expect(summarizeHealth({ health: undefined, isError: true }).verdict).toBe('unreachable');
    expect(summarizeHealth({ health: undefined, isError: false }).verdict).toBe('unknown');
  });

  it('reports the missing Lesta key as its own degraded state', () => {
    const health: Health = {
      ...HEALTHY,
      status: 'degraded',
      details: {
        ...HEALTHY.details,
        worker: { status: 'up', state: 'ok', mode: 'no_lesta_key' },
        lestaCircuit: { status: 'degraded', state: 'not_configured' }
      }
    };

    expect(summarizeHealth({ health, isError: false })).toMatchObject({ verdict: 'noLestaKey', status: 'degraded' });
    expect(noteOf(health, 'lestaCircuit')).toBe('notConfigured');
  });

  it('lets a down component outrank the missing key', () => {
    const health: Health = {
      ...HEALTHY,
      status: 'error',
      details: { ...HEALTHY.details, redis: { status: 'down', message: 'ECONNREFUSED' }, worker: { status: 'up', state: 'ok', mode: 'no_lesta_key' } }
    };

    expect(summarizeHealth({ health, isError: false }).verdict).toBe('down');
  });

  it('marks a stale collector heartbeat', () => {
    const health: Health = { ...HEALTHY, status: 'degraded', details: { ...HEALTHY.details, worker: { status: 'degraded', state: 'stale' } } };

    expect(summarizeHealth({ health, isError: false }).verdict).toBe('degraded');
    expect(noteOf(health, 'worker')).toBe('stale');
  });

  it('keeps an indicator the API did not send as unknown', () => {
    const health: Health = { ...REPORT, status: 'ok', details: { database: { status: 'up' } } };

    expect(noteOf(health, 'worker')).toBe('unknown');
    expect(noteOf(health, 'redis')).toBe('unknown');
  });

  it('shows the heartbeat time only on the collector', () => {
    const components = summarizeHealth({ health: HEALTHY, isError: false }).components;

    expect(components.find(({ key }) => key === 'worker')?.checkedAt).toBe(HEALTHY.details.worker?.collectedAt);
    expect(components.find(({ key }) => key === 'database')?.checkedAt).toBeNull();
  });
});
