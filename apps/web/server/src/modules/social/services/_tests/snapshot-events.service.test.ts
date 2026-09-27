import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';
import type { SnapshotEventRow } from '../../social.types';

import { FEED } from '../../config';
import { SnapshotEventsService } from '../snapshot-events.service';

const since = new Date('2026-09-01T00:00:00Z');
const until = new Date('2026-09-08T00:00:00Z');

const event = (fields: Partial<SnapshotEventRow>): SnapshotEventRow => ({
  account_id: 1n,
  tank_id: 1,
  captured_at: since,
  marks_on_gun: null,
  prev_marks: null,
  mark_of_mastery: 0,
  prev_mastery: null,
  ...fields
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  return { service: new SnapshotEventsService(prisma), prisma };
};

describe('SnapshotEventsService.tankEvents', () => {
  it('returns nothing without querying when there are no accounts', async () => {
    const { service, prisma } = createService();

    expect(await service.tankEvents({ accountIds: [], since, until })).toEqual([]);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });
});

describe('SnapshotEventsService.recordEvents', () => {
  it('returns nothing without querying when there are no accounts', async () => {
    const { service, prisma } = createService();

    expect(await service.recordEvents({ accountIds: [], since, until })).toEqual([]);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });
});

describe('SnapshotEventsService.markCounts', () => {
  it('sums every mark increase per account', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValue([
      event({ account_id: 1n, tank_id: 1, marks_on_gun: 2, prev_marks: 1 }),
      event({ account_id: 1n, tank_id: 2, marks_on_gun: 3, prev_marks: 1 }),
      event({ account_id: 2n, tank_id: 1, marks_on_gun: 1, prev_marks: 0 })
    ]);

    expect(await service.markCounts({ accountIds: [1n, 2n], since, until })).toEqual(
      new Map([
        [1n, 3],
        [2n, 1]
      ])
    );
  });

  it('ignores mastery-only rows and marks without a previous value', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValue([
      event({ marks_on_gun: 2, prev_marks: 2, mark_of_mastery: FEED.aceMastery, prev_mastery: FEED.aceMastery - 1 }),
      event({ marks_on_gun: 1, prev_marks: null })
    ]);

    expect(await service.markCounts({ accountIds: [1n], since, until })).toEqual(new Map());
  });

  it('counts nothing for an empty circle', async () => {
    const { service, prisma } = createService();

    expect(await service.markCounts({ accountIds: [], since, until })).toEqual(new Map());
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });
});
