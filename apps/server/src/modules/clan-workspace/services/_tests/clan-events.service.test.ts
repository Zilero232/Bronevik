import { addHours, subHours, subMinutes } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';
import type { ClanAccessService } from '../clan-access.service';

import { AppBadRequestException, AppNotFoundException } from '../../../../common/exceptions';
import { CLAN_WORKSPACE } from '../../config';
import { ClanEventsService } from '../clan-events.service';
import { scope, startsAt, withAttendance } from './clan-events.fixtures';

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const access = mock<ClanAccessService>();

  access.officer.mockResolvedValue({ accountId: 1n, role: 'commander', isOfficer: true });
  access.nicknames.mockResolvedValue(new Map());

  return { service: new ClanEventsService(prisma, access), prisma };
};

describe('ClanEventsService.create', () => {
  it('rejects an event that ends before it starts', async () => {
    const { service, prisma } = createService();

    await expect(
      service.create({
        ...scope,
        kind: 'stronghold',
        title: 'Stronghold',
        startsAt: startsAt.toISOString(),
        endsAt: subHours(startsAt, 1).toISOString()
      })
    ).rejects.toBeInstanceOf(AppBadRequestException);

    expect(prisma.clanEvent.create).not.toHaveBeenCalled();
  });

  it('schedules the reminder the configured lead time before the start', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.create.mockResolvedValue(withAttendance);

    await service.create({ ...scope, kind: 'stronghold', title: 'Stronghold', startsAt: startsAt.toISOString() });

    expect(prisma.clanEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          remindAt: subMinutes(startsAt, CLAN_WORKSPACE.reminderLeadMinutes),
          endsAt: addHours(startsAt, CLAN_WORKSPACE.defaultEventHours)
        })
      })
    );
  });
});

describe('ClanEventsService.find', () => {
  it('refuses an event of another clan', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findFirst.mockResolvedValue(null);

    await expect(service.find({ ...scope, id: 'e1' })).rejects.toBeInstanceOf(AppNotFoundException);
  });
});
