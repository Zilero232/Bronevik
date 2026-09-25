import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Challenge, StreamerProfile } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { Prisma } from '../../../../../generated';
import { AppBadRequestException } from '../../../../common/exceptions';
import { CHALLENGE } from '../../config';
import { ChallengeService } from '../challenge.service';

const pending: Challenge = {
  ...mock<Challenge>({ id: 'c1', code: 'ABCDE', status: 'pending', currency: 'RUB' }),
  amount: new Prisma.Decimal(500),
  progress: { battles: 0, value: 0, battleIds: [], durationMinutes: 60 }
};

const donation = { streamerUserId: 's1', externalId: 'd-1', donorName: 'Viewer', message: 'на ЛТ #ABCDE', amount: 500, currency: 'RUB' };

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.challenge.findMany.mockResolvedValue([pending]);
  prisma.challenge.findUnique.mockResolvedValue(pending);

  return { service: new ChallengeService(prisma), prisma };
};

describe('ChallengeService.handleDonation', () => {
  it('activates the matching challenge with the donor and a deadline', async () => {
    const { service, prisma } = createService();

    prisma.challenge.updateMany.mockResolvedValue({ count: 1 });

    await service.handleDonation(donation);

    expect(prisma.challenge.updateMany).toHaveBeenCalledWith({
      where: { id: 'c1', status: 'pending' },
      data: expect.objectContaining({
        status: 'active',
        donorName: 'Viewer',
        donationSource: 'donationAlerts',
        donationExternalId: 'd-1',
        expiresAt: expect.any(Date)
      })
    });
  });

  it('leaves challenges alone when the donation does not match', async () => {
    const { service, prisma } = createService();

    expect(await service.handleDonation({ ...donation, amount: 100 })).toBeNull();
    expect(prisma.challenge.updateMany).not.toHaveBeenCalled();
  });

  it('treats a replayed donation as already handled', async () => {
    const { service, prisma } = createService();

    prisma.challenge.updateMany.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: 'test' }));

    expect(await service.handleDonation(donation)).toBeNull();
  });
});

describe('ChallengeService.create', () => {
  it('needs a linked game account on the streamer profile', async () => {
    const { service, prisma } = createService();

    prisma.streamerProfile.findUnique.mockResolvedValue(mock<StreamerProfile>({ accountId: null }));
    prisma.challenge.count.mockResolvedValue(0);

    await expect(
      service.create({
        userId: 's1',
        title: '3000 on LT',
        amount: 500,
        expiresInMinutes: 60,
        condition: { metric: 'damage', value: 3000, operator: 'gte', battles: 1, aggregate: 'single' }
      })
    ).rejects.toBeInstanceOf(AppBadRequestException);
  });

  it('retries a code collision before giving up', async () => {
    const { service, prisma } = createService();
    const collision = new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: 'test' });

    prisma.streamerProfile.findUnique.mockResolvedValue(mock<StreamerProfile>({ accountId: 7n }));
    prisma.challenge.count.mockResolvedValue(0);
    prisma.challenge.create.mockRejectedValue(collision);

    await expect(
      service.create({
        userId: 's1',
        title: '3000 on LT',
        amount: 500,
        expiresInMinutes: 60,
        condition: { metric: 'damage', value: 3000, operator: 'gte', battles: 1, aggregate: 'single' }
      })
    ).rejects.toThrow();

    expect(prisma.challenge.create).toHaveBeenCalledTimes(CHALLENGE.codeAttempts);
  });
});
