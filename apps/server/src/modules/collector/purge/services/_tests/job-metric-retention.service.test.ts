import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { CollectorJobMetric } from '../../../../../../generated';
import type { PrismaService } from '../../../../../core';

import { PURGE } from '../../config';
import { JobMetricRetentionService } from '../job-metric-retention.service';

const now = new Date('2026-09-27T12:00:00Z');
const cutoff = new Date('2026-09-13T12:00:00Z');

const rows = (length: number, bucketStart: Date) =>
  Array.from({ length }, (): CollectorJobMetric => ({
    queue: 'collector.poll',
    bucketStart,
    processed: 0,
    failed: 0,
    retried: 0,
    durationMsTotal: 0n,
    lestaRequests: 0,
    lestaErrors: 0,
    lagSeconds: null,
    queueDepth: null
  }));

const createRetention = () => {
  const prisma = mockDeep<PrismaService>();

  return { prisma, retention: new JobMetricRetentionService(prisma) };
};

describe('JobMetricRetentionService.purgeExpired', () => {
  it('deletes nothing when no bucket is older than the retention window', async () => {
    const { prisma, retention } = createRetention();

    prisma.collectorJobMetric.findMany.mockResolvedValue([]);

    expect(await retention.purgeExpired(now)).toBe(0);
    expect(prisma.collectorJobMetric.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { bucketStart: { lt: cutoff } } }));
    expect(prisma.collectorJobMetric.deleteMany).not.toHaveBeenCalled();
  });

  it('deletes up to the newest bucket of a batch and keeps going while batches are full', async () => {
    const { prisma, retention } = createRetention();
    const first = new Date('2026-09-01T00:00:00Z');
    const second = new Date('2026-09-10T00:00:00Z');

    prisma.collectorJobMetric.findMany.mockResolvedValueOnce(rows(PURGE.jobMetricDeleteBatch, first)).mockResolvedValueOnce(rows(3, second));

    prisma.collectorJobMetric.deleteMany.mockResolvedValueOnce({ count: PURGE.jobMetricDeleteBatch }).mockResolvedValueOnce({ count: 3 });

    expect(await retention.purgeExpired(now)).toBe(PURGE.jobMetricDeleteBatch + 3);

    expect(prisma.collectorJobMetric.deleteMany.mock.calls.map(([args]) => args?.where?.bucketStart)).toEqual([
      { lt: cutoff, lte: first },
      { lt: cutoff, lte: second }
    ]);

    expect(prisma.collectorJobMetric.findMany).toHaveBeenCalledTimes(2);
  });
});
