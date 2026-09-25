import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Player } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { LESTA_BATCH_SIZE } from '../../../../lib/lesta';
import { JOB } from '../../contracts';
import { DispatchService } from '../services';

const createDispatch = () => {
  const prisma = mockDeep<PrismaService>();
  const pollQueue = mock<Queue>();
  const sweepQueue = mock<Queue>();

  return { prisma, pollQueue, sweepQueue, dispatch: new DispatchService(prisma, pollQueue, sweepQueue) };
};

const players = (count: number) => Array.from({ length: count }, (_, index) => mock<Player>({ accountId: BigInt(index + 1) }));

describe('DispatchService.dispatchActive', () => {
  it('does nothing when no active player is due', async () => {
    const { prisma, pollQueue, dispatch } = createDispatch();

    prisma.player.findMany.mockResolvedValue([]);

    expect(await dispatch.dispatchActive()).toBe(0);
    expect(prisma.player.updateMany).not.toHaveBeenCalled();
    expect(pollQueue.addBulk).not.toHaveBeenCalled();
  });

  it('pushes the next poll forward and queues Lesta-sized batches', async () => {
    const { prisma, pollQueue, dispatch } = createDispatch();
    const due = players(LESTA_BATCH_SIZE + 5);

    prisma.player.findMany.mockResolvedValue(due);

    expect(await dispatch.dispatchActive()).toBe(due.length);

    const [update] = prisma.player.updateMany.mock.calls[0] ?? [];
    const [jobs] = pollQueue.addBulk.mock.calls[0] ?? [];

    expect(update?.data.nextPollAt).toBeInstanceOf(Date);
    expect(jobs?.map((job) => job.name)).toEqual([JOB.poll.batch, JOB.poll.batch]);
    expect(jobs?.flatMap((job) => job.data.accountIds)).toHaveLength(due.length);
  });
});

describe('DispatchService.dispatchSweep', () => {
  it('pages through the tier until a short page and gives dormant players a lower priority', async () => {
    const { prisma, sweepQueue, dispatch } = createDispatch();

    prisma.player.findMany.mockResolvedValueOnce(players(3));

    expect(await dispatch.dispatchSweep('dormant')).toBe(3);

    const [jobs] = sweepQueue.addBulk.mock.calls[0] ?? [];

    expect(prisma.player.findMany).toHaveBeenCalledTimes(1);
    expect(jobs?.every((job) => job.name === JOB.sweep.batch && job.opts?.priority !== undefined)).toBe(true);
  });
});
