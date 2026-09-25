import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PlaySession, UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { NotificationService } from '../notification.service';

import { SessionReportsService } from '../session-reports.service';

const session = {
  ...mock<PlaySession>({ id: 's1', accountId: 7n, battles: 4, wins: 3, damageDealt: 8000, wn8: 2100 }),
  player: { nickname: 'Tanker' }
};

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const notifications = mock<NotificationService>();

  prisma.playSession.findMany.mockResolvedValue([session]);
  prisma.userLestaAccount.findMany.mockResolvedValue([mock<UserLestaAccount>({ userId: 'owner' })]);
  notifications.notifyMany.mockResolvedValue(1);

  return { service: new SessionReportsService(prisma, notifications), prisma, notifications };
};

describe('SessionReportsService', () => {
  it('reports an idle session once with per-battle averages', async () => {
    const { service, prisma, notifications } = createService();

    prisma.playSession.updateMany.mockResolvedValue({ count: 1 });

    expect(await service.run()).toBe(1);

    expect(notifications.notifyMany).toHaveBeenCalledWith({
      userIds: ['owner'],
      dedupeKey: 'session-s1',
      notification: expect.objectContaining({ event: 'sessionFinished', battles: 4, winRate: 0.75, avgDamage: 2000, wn8: 2100 })
    });
  });

  it('skips a session another worker already claimed', async () => {
    const { service, prisma, notifications } = createService();

    prisma.playSession.updateMany.mockResolvedValue({ count: 0 });

    expect(await service.run()).toBe(0);
    expect(notifications.notifyMany).not.toHaveBeenCalled();
  });
});
