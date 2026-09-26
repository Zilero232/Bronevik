import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { Prisma } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { GrantShellsInput } from '../../progression.types';

import { ShellLedgerService } from '../shell-ledger.service';

const now = new Date('2026-09-26T10:00:00Z');
const grant: GrantShellsInput = { userId: 'u', amount: 10, reason: 'level', key: 'level:7:1:2', points: 30, now };

const sumOf = (amount: number | null) => ({ _sum: { amount }, _count: {}, _avg: {}, _min: {}, _max: {} });

const setup = () => {
  const prisma = mockDeep<PrismaService>();
  const tx = mockDeep<Prisma.TransactionClient>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { prisma, tx, service: new ShellLedgerService(prisma) };
};

describe('ShellLedgerService.grant', () => {
  it('grants a new key and adds its season points', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.createMany.mockResolvedValue({ count: 1 });

    expect(await service.grant(grant)).toBe(true);

    expect(prisma.seasonProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ userId: 'u', points: grant.points }) })
    );
  });

  it('ignores a key that was already granted, adding no season points', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.createMany.mockResolvedValue({ count: 0 });

    expect(await service.grant(grant)).toBe(false);
    expect(prisma.seasonProgress.upsert).not.toHaveBeenCalled();
  });

  it('writes the entry with duplicates skipped so a retry cannot double it', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.createMany.mockResolvedValue({ count: 1 });

    await service.grant(grant);

    expect(prisma.shellLedgerEntry.createMany).toHaveBeenCalledWith(expect.objectContaining({ skipDuplicates: true }));
  });

  it('skips the season track for a grant without points', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.createMany.mockResolvedValue({ count: 1 });

    expect(await service.grant({ ...grant, points: 0 })).toBe(true);
    expect(prisma.seasonProgress.upsert).not.toHaveBeenCalled();
  });
});

describe('ShellLedgerService.spend', () => {
  it('refuses a purchase above the balance and writes nothing', async () => {
    const { tx, service } = setup();

    tx.shellLedgerEntry.aggregate.mockResolvedValue(sumOf(99));

    await expect(service.spend({ userId: 'u', amount: 100, key: 'purchase:u:x', tx })).rejects.toMatchObject({ status: 409 });
    expect(tx.shellLedgerEntry.create).not.toHaveBeenCalled();
  });

  it('allows spending exactly the balance as a negative entry', async () => {
    const { tx, service } = setup();

    tx.shellLedgerEntry.aggregate.mockResolvedValue(sumOf(100));

    await service.spend({ userId: 'u', amount: 100, key: 'purchase:u:x', tx });

    expect(tx.shellLedgerEntry.create).toHaveBeenCalledWith({ data: expect.objectContaining({ amount: -100, reason: 'purchase' }) });
  });

  it('locks the user balance before reading it', async () => {
    const { tx, service } = setup();

    tx.shellLedgerEntry.aggregate.mockResolvedValue(sumOf(10));

    await service.spend({ userId: 'u', amount: 1, key: 'k', tx });

    expect(tx.$executeRaw.mock.invocationCallOrder[0]).toBeLessThan(tx.shellLedgerEntry.aggregate.mock.invocationCallOrder[0] ?? 0);
  });
});

describe('ShellLedgerService.balance', () => {
  it('is zero for a user without entries', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.aggregate.mockResolvedValue(sumOf(null));

    expect(await service.balance('u')).toBe(0);
  });

  it('never goes below zero', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.aggregate.mockResolvedValue(sumOf(-5));

    expect(await service.balance('u')).toBe(0);
  });
});

describe('ShellLedgerService.summary', () => {
  it('reports earned and spent as positive numbers with the balance between them', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.aggregate.mockResolvedValueOnce(sumOf(120)).mockResolvedValueOnce(sumOf(-45));
    prisma.shellLedgerEntry.findMany.mockResolvedValue([]);

    const summary = await service.summary('u');

    expect(summary).toMatchObject({ earned: 120, spent: 45 });
    expect(summary.balance).toBe(summary.earned - summary.spent);
  });

  it('is empty for a new user', async () => {
    const { prisma, service } = setup();

    prisma.shellLedgerEntry.aggregate.mockResolvedValue(sumOf(null));
    prisma.shellLedgerEntry.findMany.mockResolvedValue([]);

    expect(await service.summary('u')).toEqual({ balance: 0, earned: 0, spent: 0, entries: [] });
  });
});
