import { subHours } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';
import type { ClanAccessService } from '../clan-access.service';

import { CLAN_WORKSPACE } from '../../config';
import { ClanEventAttendanceService } from '../clan-event-attendance.service';
import { ClanEventsService } from '../clan-events.service';
import { attendance, clanEvent, defense, member, now, played, scope, skirmish, startsAt, withAttendance } from './clan-events.fixtures';

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const access = mock<ClanAccessService>();

  access.officer.mockResolvedValue({ accountId: 1n, role: 'commander', isOfficer: true });
  access.member.mockResolvedValue({ accountId: 1n, role: 'commander', isOfficer: true });
  access.nicknames.mockResolvedValue(new Map());
  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.clanEvent.findUniqueOrThrow.mockResolvedValue(withAttendance);
  prisma.clanAttendance.findMany.mockResolvedValue([]);

  const events = new ClanEventsService(prisma, access);

  return { service: new ClanEventAttendanceService(prisma, access, events), prisma, access };
};

const upsertedStatuses = (prisma: ReturnType<typeof createService>['prisma']) =>
  new Map(prisma.clanAttendance.upsert.mock.calls.map(([args]) => [args.where.eventId_accountId?.accountId, args.create.status]));

describe('ClanEventAttendanceService.syncFinished', () => {
  it('marks members whose stronghold battles grew as attended and the rest as absent', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue([clanEvent()]);
    prisma.clanMember.findMany.mockResolvedValue([member(1n), member(2n)]);

    prisma.accountSnapshot.findMany.mockResolvedValue([
      ...played({ accountId: 1n, mode: skirmish, grew: false }),
      ...played({ accountId: 1n, mode: defense, grew: true }),
      ...played({ accountId: 2n, mode: skirmish, grew: false })
    ]);

    expect(await service.syncFinished(now)).toBe(1);

    expect(upsertedStatuses(prisma)).toEqual(
      new Map([
        [1n, 'attended'],
        [2n, 'absent']
      ])
    );
  });

  it('never overwrites a manual attended or absent row', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue([clanEvent()]);
    prisma.clanMember.findMany.mockResolvedValue([member(1n), member(2n)]);

    prisma.accountSnapshot.findMany.mockResolvedValue([
      ...played({ accountId: 1n, mode: skirmish, grew: true }),
      ...played({ accountId: 2n, mode: skirmish, grew: true })
    ]);

    prisma.clanAttendance.findMany.mockResolvedValue([attendance(2n, 'absent')]);

    await service.syncFinished(now);

    expect(prisma.clanAttendance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { eventId: 'e1', source: 'manual', status: { in: ['attended', 'absent'] } } })
    );

    expect(upsertedStatuses(prisma)).toEqual(new Map([[1n, 'attended']]));
  });

  it('skips events whose attendance was already synced', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue([clanEvent({ data: { attendanceSyncedAt: startsAt.toISOString() } })]);

    expect(await service.syncFinished(now)).toBe(0);
    expect(prisma.accountSnapshot.findMany).not.toHaveBeenCalled();
  });

  it('stamps the event as synced with the time it was given', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue([clanEvent()]);
    prisma.clanMember.findMany.mockResolvedValue([member(1n)]);
    prisma.accountSnapshot.findMany.mockResolvedValue(played({ accountId: 1n, mode: skirmish, grew: true }));

    await service.syncFinished(now);

    expect(prisma.clanEvent.update).toHaveBeenCalledWith({
      where: { id: 'e1' },
      data: { data: expect.objectContaining({ attendanceSyncedAt: now.toISOString() }) }
    });
  });

  it('also picks up events without an end time, judged by the default duration', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue([]);

    await service.syncFinished(now);

    expect(prisma.clanEvent.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        OR: expect.arrayContaining([
          {
            endsAt: null,
            startsAt: {
              lte: subHours(now, CLAN_WORKSPACE.snapshotSlackHours / 4 + CLAN_WORKSPACE.defaultEventHours),
              gte: subHours(now, CLAN_WORKSPACE.syncLookbackHours + CLAN_WORKSPACE.defaultEventHours)
            }
          }
        ])
      })
    });
  });
});

describe('ClanEventAttendanceService.syncFromApi', () => {
  it('writes api attendance for the requested event', async () => {
    const { service, prisma, access } = createService();

    prisma.clanEvent.findFirst.mockResolvedValue(clanEvent());
    prisma.clanMember.findMany.mockResolvedValue([member(1n)]);
    prisma.accountSnapshot.findMany.mockResolvedValue(played({ accountId: 1n, mode: skirmish, grew: true }));

    await service.syncFromApi({ ...scope, id: 'e1' });

    expect(access.officer).toHaveBeenCalledWith(scope);

    expect(prisma.clanAttendance.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ accountId: 1n, status: 'attended', source: 'api' }) })
    );
  });

  it('does nothing for an event kind the API cannot observe', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findFirst.mockResolvedValue(clanEvent({ kind: 'training' }));

    await service.syncFromApi({ ...scope, id: 'e1' });

    expect(prisma.accountSnapshot.findMany).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
