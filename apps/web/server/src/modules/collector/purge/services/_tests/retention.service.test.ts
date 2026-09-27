import { subDays } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../../core';

import { RETENTION } from '../../config';
import { RetentionService } from '../retention.service';

const now = new Date('2026-09-27T12:00:00Z');

const createRetention = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.$executeRawUnsafe.mockResolvedValue(0);

  return { prisma, retention: new RetentionService(prisma) };
};

describe('RetentionService.purgeExpired', () => {
  it('runs every retention rule with its own cutoff', async () => {
    const { prisma, retention } = createRetention();

    const result = await retention.purgeExpired(now);

    expect(Object.keys(result)).toEqual(RETENTION.rules.map((rule) => rule.table));
    expect(prisma.$executeRawUnsafe.mock.calls.map(([, cutoff]) => cutoff)).toEqual(RETENTION.rules.map((rule) => subDays(now, rule.days)));
  });

  it('keeps deleting a table in batches until a batch comes back short', async () => {
    const { prisma, retention } = createRetention();
    const [first] = RETENTION.rules;

    prisma.$executeRawUnsafe.mockResolvedValueOnce(RETENTION.deleteBatch).mockResolvedValueOnce(3);

    const result = await retention.purgeExpired(now);

    expect(result[first.table]).toBe(RETENTION.deleteBatch + 3);
    expect(prisma.$executeRawUnsafe).toHaveBeenCalledTimes(RETENTION.rules.length + 1);
  });

  it('never deletes a webhook delivery that is still pending', async () => {
    const { prisma, retention } = createRetention();

    await retention.purgeExpired(now);

    const statement = prisma.$executeRawUnsafe.mock.calls.map(([sql]) => sql).find((sql) => sql.includes('webhook_delivery'));

    expect(statement).toContain("status <> 'pending'");
  });

  it('keeps the latest percentile row of every tank however stale, so the references never empty out', async () => {
    const { prisma, retention } = createRetention();

    await retention.purgeExpired(now);

    const statement = prisma.$executeRawUnsafe.mock.calls.map(([sql]) => sql).find((sql) => sql.startsWith('DELETE FROM tank_percentile'));

    expect(statement).toMatch(/date < \(SELECT max\(latest\.date\) FROM tank_percentile latest WHERE latest\.tank_id = tank_percentile\.tank_id/u);
  });
});
