import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { LestaClient } from '../../../../lib/lesta';
import type { EntitlementsService } from '../../../billing';
import type { CollectorProducerService } from '../../../collector';

import { LestaAccountsService } from '../lesta-accounts.service';

const identity = { userId: 'user', accountId: 7, nickname: 'Tanker', accessToken: 'token', expiresAt: new Date() };

const createService = ({ others, isKnown }: { others: number; isKnown: boolean }) => {
  const prisma = mockDeep<PrismaService>();
  const entitlements = mock<EntitlementsService>();
  const collector = mock<CollectorProducerService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  prisma.userLestaAccount.count
    .mockResolvedValueOnce(others)
    .mockResolvedValueOnce(isKnown ? 1 : 0)
    .mockResolvedValueOnce(0);

  entitlements.limit.mockResolvedValue(2);

  return { service: new LestaAccountsService(prisma, collector, entitlements, mock<LestaClient>()), prisma, collector };
};

describe('LestaAccountsService.link', () => {
  it('refuses a new account over the linked accounts limit of the plan', async () => {
    const { service, prisma, collector } = createService({ others: 2, isKnown: false });

    await expect(service.link(identity)).resolves.toBe(false);
    expect(prisma.userLestaAccount.upsert).not.toHaveBeenCalled();
    expect(collector.enrol).not.toHaveBeenCalled();
  });

  it('still signs in with an account that is already linked', async () => {
    const { service, prisma } = createService({ others: 2, isKnown: true });

    await expect(service.link(identity)).resolves.toBe(true);
    expect(prisma.userLestaAccount.upsert).toHaveBeenCalled();
  });

  it('links an account within the limit', async () => {
    const { service } = createService({ others: 1, isKnown: false });

    await expect(service.link(identity)).resolves.toBe(true);
  });
});

describe('LestaAccountsService.primaryAccountId', () => {
  it('returns the primary linked account first', async () => {
    const { service, prisma } = createService({ others: 0, isKnown: false });

    prisma.userLestaAccount.findFirst.mockResolvedValue(mock<UserLestaAccount>({ accountId: 42n }));

    await expect(service.primaryAccountId('user')).resolves.toBe(42);

    expect(prisma.userLestaAccount.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ isPrimary: 'desc' }, { linkedAt: 'asc' }] })
    );
  });

  it('returns null without a linked account', async () => {
    const { service, prisma } = createService({ others: 0, isKnown: false });

    prisma.userLestaAccount.findFirst.mockResolvedValue(null);

    await expect(service.primaryAccountId('user')).resolves.toBeNull();
  });
});
