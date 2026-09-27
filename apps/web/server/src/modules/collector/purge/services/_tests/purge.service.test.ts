import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { DataDeletionRequest, Player } from '../../../../../../generated';
import type { PrismaService } from '../../../../../core';

import { HYPERTABLE } from '../../../../../core';
import { JOB } from '../../../contracts';
import { PurgeService } from '../purge.service';

const requestId = '00000000-0000-4000-8000-000000000001';

const createPurge = () => {
  const prisma = mockDeep<PrismaService>();

  const queue = mock<Queue>();

  prisma.$transaction.mockImplementation(async (run) => run(prisma));

  return { prisma, queue, purge: new PurgeService(prisma, queue) };
};

const statuses = (prisma: ReturnType<typeof createPurge>['prisma']) => prisma.dataDeletionRequest.update.mock.calls.map(([{ data }]) => data.status);

describe('PurgeService.purgeAccount', () => {
  it('deletes the account from every hypertable and closes the request', async () => {
    const { prisma, purge } = createPurge();

    await purge.purgeAccount({ accountId: 5, requestId });

    expect(prisma.$executeRawUnsafe).toHaveBeenCalledTimes(Object.values(HYPERTABLE).length);
    expect(prisma.player.deleteMany).toHaveBeenCalledWith(expect.objectContaining({ where: { accountId: 5n } }));
    expect(statuses(prisma)).toEqual(['processing', 'completed']);
  });

  it('clears the account from the tables that have no cascade to the player', async () => {
    const { prisma, purge } = createPurge();

    await purge.purgeAccount({ accountId: 5 });

    for (const remove of [
      prisma.clanMemberEvent.deleteMany,
      prisma.weeklyChallengeProgress.deleteMany,
      prisma.clanAttendance.deleteMany,
      prisma.recruitCandidate.deleteMany,
      prisma.competitionEntry.deleteMany
    ]) {
      expect(remove).toHaveBeenCalledWith({ where: { accountId: 5n } });
    }

    expect(prisma.replay.updateMany).toHaveBeenCalledWith({ where: { accountId: 5n }, data: { accountId: null } });
    expect(prisma.$executeRaw).toHaveBeenCalled();
  });

  it('removes the account id from the honest-rng daily player sets', async () => {
    const { prisma, purge } = createPurge();

    await purge.purgeAccount({ accountId: 5 });

    const rngUpdates = prisma.$executeRaw.mock.calls.flatMap(([query, ...values]) =>
      'raw' in query && query.join('').includes('rng_daily') ? [{ sql: query.join('?'), values }] : []
    );

    expect(rngUpdates).toEqual([{ sql: expect.stringContaining('players = array_remove(players, ?)'), values: [5n, 5n] }]);
  });

  it('marks the request failed and rethrows so the job retries', async () => {
    const { prisma, purge } = createPurge();

    prisma.player.deleteMany.mockRejectedValue(new Error('lock timeout'));

    await expect(purge.purgeAccount({ accountId: 5, requestId })).rejects.toThrow('lock timeout');
    expect(statuses(prisma)).toEqual(['processing', 'failed']);
  });

  it('purges without touching deletion requests when run without one', async () => {
    const { prisma, purge } = createPurge();

    await purge.purgeAccount({ accountId: 5 });

    expect(prisma.player.deleteMany).toHaveBeenCalledOnce();
    expect(prisma.dataDeletionRequest.update).not.toHaveBeenCalled();
  });

  it('rethrows a failed purge without a request so the job retries', async () => {
    const { prisma, purge } = createPurge();

    prisma.player.deleteMany.mockRejectedValue(new Error('lock timeout'));

    await expect(purge.purgeAccount({ accountId: 5 })).rejects.toThrow('lock timeout');
    expect(prisma.dataDeletionRequest.update).not.toHaveBeenCalled();
  });
});

describe('PurgeService.dispatch', () => {
  const pending = (id: string, accountId: bigint) => mock<DataDeletionRequest>({ id, accountId });

  it('opens a retention request only for expired players without an open one', async () => {
    const { prisma, purge } = createPurge();

    prisma.player.findMany.mockResolvedValue([mock<Player>({ accountId: 1n }), mock<Player>({ accountId: 2n })]);
    prisma.dataDeletionRequest.findMany.mockResolvedValueOnce([pending('open', 1n)]).mockResolvedValueOnce([]);

    await purge.dispatch();

    expect(prisma.dataDeletionRequest.createMany.mock.calls[0]?.[0]?.data).toEqual([expect.objectContaining({ accountId: 2n, source: 'retention' })]);
  });

  it('queues every pending request once, keyed by its id', async () => {
    const { prisma, queue, purge } = createPurge();

    prisma.player.findMany.mockResolvedValue([]);
    prisma.dataDeletionRequest.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([pending('r1', 1n), pending('r2', 2n)]);

    expect(await purge.dispatch()).toBe(2);

    const [jobs = []] = queue.addBulk.mock.calls[0] ?? [];

    expect(jobs.map((job) => [job.name, job.data])).toEqual([
      [JOB.purge.account, { accountId: 1, requestId: 'r1' }],
      [JOB.purge.account, { accountId: 2, requestId: 'r2' }]
    ]);

    expect(new Set(jobs.map((job) => job.opts?.jobId)).size).toBe(jobs.length);
  });

  it('dispatches nothing when no request is pending', async () => {
    const { prisma, purge } = createPurge();

    prisma.player.findMany.mockResolvedValue([]);
    prisma.dataDeletionRequest.findMany.mockResolvedValue([]);

    expect(await purge.dispatch()).toBe(0);
  });
});
