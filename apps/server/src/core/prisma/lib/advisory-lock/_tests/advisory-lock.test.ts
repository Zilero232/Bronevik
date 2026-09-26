import { describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { Prisma } from '../../../../../../generated';
import type { PrismaService } from '../../../prisma.service';

import { lockedTransaction } from '../advisory-lock';

describe('lockedTransaction', () => {
  it('takes the scoped advisory lock inside the transaction before running the work', async () => {
    const prisma = mockDeep<PrismaService>();
    const tx = mockDeep<Prisma.TransactionClient>();
    const run = vi.fn(async () => 'done');

    prisma.$transaction.mockImplementation(async (work) => (typeof work === 'function' ? work(tx) : Promise.all(work)));

    const result = await lockedTransaction({ prisma, scope: 'limit:goals', key: 'user', run });

    expect(result).toBe('done');
    expect(tx.$executeRaw.mock.invocationCallOrder[0]).toBeLessThan(run.mock.invocationCallOrder[0] ?? 0);
    expect(tx.$executeRaw.mock.calls[0]?.slice(1)).toEqual(['limit:goals', 'user']);
  });
});
