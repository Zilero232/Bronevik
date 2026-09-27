import type { Job } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { CircuitBreakerService } from '../circuit-breaker.service';
import { METRICS } from '../config';
import { MetricsService } from '../metrics.service';

const createMetrics = () => {
  const prisma = mockDeep<PrismaService>();
  const breaker = mock<CircuitBreakerService>();

  return { prisma, breaker, metrics: new MetricsService(prisma, breaker) };
};

const job = (attemptsMade = 0) => mock<Job>({ queueName: 'collector.poll', attemptsMade });

const flushed = async (setup: ReturnType<typeof createMetrics>) => {
  await setup.metrics.flush();

  return setup.prisma.collectorJobMetric.upsert.mock.calls.map(([{ create }]) => create);
};

describe('MetricsService.track', () => {
  it('counts a processed job under its queue and returns the result', async () => {
    const setup = createMetrics();

    expect(await setup.metrics.track({ job: job(), run: async () => 'done' })).toBe('done');

    const [row] = await flushed(setup);

    expect(row).toMatchObject({ queue: 'collector.poll', processed: 1, failed: 0, retried: 0 });
  });

  it('counts a failure and a retry and rethrows', async () => {
    const setup = createMetrics();

    await expect(
      setup.metrics.track({
        job: job(1),
        run: async () => {
          throw new Error('boom');
        }
      })
    ).rejects.toThrow('boom');

    const [row] = await flushed(setup);

    expect(row).toMatchObject({ processed: 0, failed: 1, retried: 1 });
  });

  it('attributes Lesta calls to the queue of the running job', async () => {
    const setup = createMetrics();

    await setup.metrics.track({ job: job(), run: async () => setup.metrics.recordLesta({ outcome: 'degraded' }) });

    const [row] = await flushed(setup);

    expect(row).toMatchObject({ queue: 'collector.poll', lestaRequests: 1, lestaErrors: 1 });
  });

  it('files Lesta calls outside a job under the unscoped bucket', async () => {
    const setup = createMetrics();

    setup.metrics.recordLesta({ outcome: 'ok' });

    const [row] = await flushed(setup);

    expect(row?.queue).toBe(METRICS.unscopedQueue);
  });
});

describe('MetricsService.recordLesta', () => {
  it('feeds the breaker with outages but not with our own rejected requests', () => {
    const { breaker, metrics } = createMetrics();

    metrics.recordLesta({ outcome: 'ok' });
    metrics.recordLesta({ outcome: 'degraded' });
    metrics.recordLesta({ outcome: 'rejected' });

    expect(breaker.record.mock.calls).toEqual([[true], [false]]);
  });
});
