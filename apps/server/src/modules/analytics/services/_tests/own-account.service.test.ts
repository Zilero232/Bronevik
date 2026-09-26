import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { OwnAccountService } from '../own-account.service';

const primary = 100n;
const secondary = 200n;

const setup = (accountIds: bigint[]) => {
  const prisma = mockDeep<PrismaService>();

  prisma.userLestaAccount.findMany.mockResolvedValue(accountIds.map((accountId) => mock<UserLestaAccount>({ accountId })));

  return { prisma, service: new OwnAccountService(prisma) };
};

describe('OwnAccountService.find', () => {
  it('picks the first linked account when none is requested', async () => {
    const { service } = setup([primary, secondary]);

    expect(await service.find({ userId: 'u' })).toBe(primary);
  });

  it('returns the requested account when the user owns it', async () => {
    const { service } = setup([primary, secondary]);

    expect(await service.find({ userId: 'u', account: Number(secondary) })).toBe(secondary);
  });

  it('refuses an account linked to someone else', async () => {
    const { service } = setup([primary]);

    expect(await service.find({ userId: 'u', account: Number(secondary) })).toBeNull();
  });

  it('returns null when no account is linked', async () => {
    const { service } = setup([]);

    expect(await service.find({ userId: 'u' })).toBeNull();
  });
});

describe('OwnAccountService.resolve', () => {
  it('returns the owned account', async () => {
    const { service } = setup([primary]);

    expect(await service.resolve({ userId: 'u' })).toBe(primary);
  });

  it('throws not found when the user has no linked account', async () => {
    const { service } = setup([]);

    await expect(service.resolve({ userId: 'u' })).rejects.toMatchObject({ status: 404 });
  });

  it('throws not found for a foreign account', async () => {
    const { service } = setup([primary]);

    await expect(service.resolve({ userId: 'u', account: Number(secondary) })).rejects.toMatchObject({ status: 404 });
  });
});
