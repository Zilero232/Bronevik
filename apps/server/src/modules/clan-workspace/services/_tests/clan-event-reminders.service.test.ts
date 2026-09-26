import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';
import type { NotificationService } from '../../../notifications';
import type { ClanAccessService } from '../clan-access.service';

import { ClanEventRemindersService } from '../clan-event-reminders.service';
import { clanEvent, clanId, startsAt } from './clan-events.fixtures';

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const access = mock<ClanAccessService>();
  const notifications = mock<NotificationService>();

  access.userIdsOf.mockResolvedValue(['u1', 'u2']);

  return { service: new ClanEventRemindersService(prisma, access, notifications), prisma, notifications };
};

describe('ClanEventRemindersService.sendReminders', () => {
  const due = [
    { ...clanEvent({ id: 'e1' }), workspace: { clan: { tag: 'BRNV' } } },
    { ...clanEvent({ id: 'e2' }), workspace: { clan: { tag: 'BRNV' } } }
  ];

  it('notifies the clan once per event it manages to claim', async () => {
    const { service, prisma, notifications } = createService();

    prisma.clanEvent.findMany.mockResolvedValue(due);
    prisma.clanEvent.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    await service.sendReminders(startsAt);

    expect(notifications.notifyMany).toHaveBeenCalledTimes(1);

    expect(notifications.notifyMany).toHaveBeenCalledWith({
      userIds: ['u1', 'u2'],
      dedupeKey: 'clan-event-e1',
      notification: expect.objectContaining({ event: 'clanEventReminder', clanId, clanTag: 'BRNV', startsAt: startsAt.toISOString() })
    });
  });

  it('counts only the reminders it actually sent', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue(due);
    prisma.clanEvent.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    expect(await service.sendReminders(startsAt)).toBe(1);
  });

  it('claims an event only while it has not been reminded yet', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue(due.slice(0, 1));
    prisma.clanEvent.updateMany.mockResolvedValue({ count: 1 });

    await service.sendReminders(startsAt);

    expect(prisma.clanEvent.updateMany).toHaveBeenCalledWith({ where: { id: 'e1', remindedAt: null }, data: { remindedAt: startsAt } });
  });
});
