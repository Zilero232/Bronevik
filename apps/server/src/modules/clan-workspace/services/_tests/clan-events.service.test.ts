import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AccountSnapshot, ClanAttendance, ClanEvent, ClanMember, StatsMode } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { NotificationService } from '../../../notifications';
import type { EventWithAttendance } from '../../lib';
import type { ClanAccessService } from '../clan-access.service';

import { AppBadRequestException } from '../../../../common/exceptions';
import { ATTENDANCE_MODES, CLAN_WORKSPACE } from '../../config';
import { ClanEventsService } from '../clan-events.service';

const clanId = 100;
const scope = { clanId, userId: 'u1' };
const hour = 3_600_000;
const startsAt = new Date('2026-09-20T18:00:00Z');
const endsAt = new Date(startsAt.getTime() + 2 * hour);
const now = new Date(endsAt.getTime() + CLAN_WORKSPACE.snapshotSlackMs);
const [skirmish, defense] = ATTENDANCE_MODES.stronghold;

const clanEvent = (fields: Partial<ClanEvent> = {}): ClanEvent => ({
  id: 'e1',
  clanId: BigInt(clanId),
  kind: 'stronghold',
  title: 'Stronghold',
  startsAt,
  endsAt,
  remindAt: null,
  remindedAt: null,
  data: null,
  createdAt: startsAt,
  ...fields
});

const member = (accountId: bigint): ClanMember => ({ accountId, clanId: BigInt(clanId), role: 'private', joinedAt: null, updatedAt: startsAt });

const attendance = (accountId: bigint, status: ClanAttendance['status']): ClanAttendance => ({
  eventId: 'e1',
  accountId,
  status,
  source: 'manual',
  updatedAt: startsAt
});

const snapshot = ({
  accountId,
  mode,
  capturedAt,
  battles
}: Pick<AccountSnapshot, 'accountId' | 'battles' | 'capturedAt' | 'mode'>): AccountSnapshot => ({
  accountId,
  mode,
  capturedAt,
  battles,
  wins: 0,
  losses: 0,
  draws: 0,
  damageDealt: 0n,
  damageReceived: 0n,
  frags: 0,
  spotted: 0,
  xp: 0n,
  battleAvgXp: 0,
  survived: 0,
  hits: 0,
  shots: 0,
  piercings: 0,
  piercingsReceived: 0,
  explosionHits: 0,
  directHitsReceived: 0,
  noDamageDirectHitsReceived: 0,
  explosionHitsReceived: null,
  capturePoints: 0,
  droppedCapturePoints: 0,
  avgDamageBlocked: 0,
  avgDamageAssisted: null,
  avgDamageAssistedRadio: null,
  avgDamageAssistedTrack: null,
  tankingFactor: null,
  stunAssistedDamage: 0n,
  stunNumber: 0,
  maxDamage: null,
  maxDamageTankId: null,
  maxFrags: null,
  maxFragsTankId: null,
  maxXp: null,
  maxXpTankId: null,
  globalRating: null
});

const withAttendance: EventWithAttendance = { ...clanEvent(), attendance: [] };

const before = new Date(startsAt.getTime() - hour);
const after = new Date(endsAt.getTime() + hour);

const played = ({ accountId, mode, grew }: { accountId: bigint; mode: StatsMode; grew: boolean }) => [
  snapshot({ accountId, mode, capturedAt: before, battles: 10 }),
  snapshot({ accountId, mode, capturedAt: after, battles: grew ? 12 : 10 })
];

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const access = mock<ClanAccessService>();
  const notifications = mock<NotificationService>();

  access.officer.mockResolvedValue({ accountId: 1n, role: 'commander', isOfficer: true });
  access.member.mockResolvedValue({ accountId: 1n, role: 'commander', isOfficer: true });
  access.nicknames.mockResolvedValue(new Map());
  access.userIdsOf.mockResolvedValue(['u1', 'u2']);
  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.clanEvent.findUniqueOrThrow.mockResolvedValue(withAttendance);
  prisma.clanAttendance.findMany.mockResolvedValue([]);

  return { service: new ClanEventsService(prisma, access, notifications), prisma, access, notifications };
};

const upsertedStatuses = (prisma: ReturnType<typeof createService>['prisma']) =>
  new Map(prisma.clanAttendance.upsert.mock.calls.map(([args]) => [args.where.eventId_accountId?.accountId, args.create.status]));

describe('ClanEventsService.create', () => {
  it('rejects an event that ends before it starts', async () => {
    const { service, prisma } = createService();

    await expect(
      service.create({
        ...scope,
        kind: 'stronghold',
        title: 'Stronghold',
        startsAt: startsAt.toISOString(),
        endsAt: new Date(startsAt.getTime() - hour).toISOString()
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
          remindAt: new Date(startsAt.getTime() - CLAN_WORKSPACE.reminderLeadMinutes * 60_000),
          endsAt: new Date(startsAt.getTime() + CLAN_WORKSPACE.defaultEventHours * hour)
        })
      })
    );
  });
});

describe('ClanEventsService.sendReminders', () => {
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

  it('claims an event only while it has not been reminded yet', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue(due.slice(0, 1));
    prisma.clanEvent.updateMany.mockResolvedValue({ count: 1 });

    await service.sendReminders(startsAt);

    expect(prisma.clanEvent.updateMany).toHaveBeenCalledWith({ where: { id: 'e1', remindedAt: null }, data: { remindedAt: startsAt } });
  });
});

describe('ClanEventsService.syncFinished', () => {
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

  it('stamps the event as synced along with the attendance writes', async () => {
    const { service, prisma } = createService();

    prisma.clanEvent.findMany.mockResolvedValue([clanEvent()]);
    prisma.clanMember.findMany.mockResolvedValue([member(1n)]);
    prisma.accountSnapshot.findMany.mockResolvedValue(played({ accountId: 1n, mode: skirmish, grew: true }));

    await service.syncFinished(now);

    expect(prisma.clanEvent.update).toHaveBeenCalledWith({
      where: { id: 'e1' },
      data: { data: expect.objectContaining({ attendanceSyncedAt: expect.any(String) }) }
    });
  });
});

describe('ClanEventsService.syncFromApi', () => {
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
