import { Injectable, Logger } from '@nestjs/common';

import type { ClanEvent } from '../../../../generated';
import type {
  ClanEventView,
  ClanItemScope,
  CreateClanEventRequest,
  ListEventsRequest,
  RsvpRequest,
  SetAttendanceRequest,
  UpdateClanEventRequest
} from '../clan-workspace.types';
import type { BattleSample } from '../lib';

import { AppBadRequestException, AppNotFoundException } from '../../../common/exceptions';
import { toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { NotificationService } from '../../notifications';
import { ATTENDANCE_MODES, CLAN_WORKSPACE } from '../config';
import { attendedAccounts, eventDataSchema, toClanEventView } from '../lib';
import { ClanAccessService } from './clan-access.service';

@Injectable()
export class ClanEventsService {
  private readonly logger = new Logger(ClanEventsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ClanAccessService,
    private readonly notifications: NotificationService
  ) {}

  async list({ clanId, userId, from, to }: ListEventsRequest): Promise<ClanEventView[]> {
    await this.access.member({ clanId, userId });

    const events = await this.prisma.clanEvent.findMany({
      where: { clanId: BigInt(clanId), startsAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } },
      orderBy: { startsAt: 'asc' },
      include: { attendance: true }
    });

    const nicknames = await this.access.nicknames(events.flatMap((event) => event.attendance.map((row) => row.accountId)));

    return events.map((event) => toClanEventView({ event, nicknames }));
  }

  async create({ clanId, userId, kind, title, startsAt, endsAt, remindMinutesBefore }: CreateClanEventRequest): Promise<ClanEventView> {
    await this.access.officer({ clanId, userId });

    const start = new Date(startsAt);
    const end = endsAt ? new Date(endsAt) : new Date(start.getTime() + CLAN_WORKSPACE.defaultEventHours * 3_600_000);

    if (end <= start) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'The event must end after it starts');
    }

    const lead = remindMinutesBefore ?? CLAN_WORKSPACE.reminderLeadMinutes;
    const event = await this.prisma.clanEvent.create({
      data: { clanId: BigInt(clanId), kind, title, startsAt: start, endsAt: end, remindAt: new Date(start.getTime() - lead * 60_000) },
      include: { attendance: true }
    });

    return toClanEventView({ event, nicknames: new Map() });
  }

  async update({ clanId, userId, id, kind, title, startsAt, endsAt, remindMinutesBefore }: UpdateClanEventRequest): Promise<ClanEventView> {
    await this.access.officer({ clanId, userId });

    const event = await this.find({ clanId, userId, id });
    const start = startsAt ? new Date(startsAt) : event.startsAt;

    await this.prisma.clanEvent.update({
      where: { id },
      data: {
        ...(kind ? { kind } : {}),
        ...(title ? { title } : {}),
        startsAt: start,
        ...(endsAt ? { endsAt: new Date(endsAt) } : {}),
        ...(remindMinutesBefore === undefined ? {} : { remindAt: new Date(start.getTime() - remindMinutesBefore * 60_000), remindedAt: null })
      }
    });

    return this.view(id);
  }

  async remove({ clanId, userId, id }: ClanItemScope): Promise<void> {
    await this.access.officer({ clanId, userId });
    await this.find({ clanId, userId, id });
    await this.prisma.clanEvent.delete({ where: { id } });
  }

  async setAttendance({ clanId, userId, id, entries }: SetAttendanceRequest): Promise<ClanEventView> {
    await this.access.officer({ clanId, userId });
    await this.find({ clanId, userId, id });

    await this.prisma.$transaction(
      entries.map((entry) =>
        this.prisma.clanAttendance.upsert({
          where: { eventId_accountId: { eventId: id, accountId: BigInt(entry.accountId) } },
          create: { eventId: id, accountId: BigInt(entry.accountId), status: entry.status, source: 'manual' },
          update: { status: entry.status, source: 'manual' }
        })
      )
    );

    return this.view(id);
  }

  async rsvp({ clanId, userId, id, status }: RsvpRequest): Promise<ClanEventView> {
    const membership = await this.access.member({ clanId, userId });

    await this.find({ clanId, userId, id });

    await this.prisma.clanAttendance.upsert({
      where: { eventId_accountId: { eventId: id, accountId: membership.accountId } },
      create: { eventId: id, accountId: membership.accountId, status, source: 'manual' },
      update: { status }
    });

    return this.view(id);
  }

  async syncFromApi({ clanId, userId, id }: ClanItemScope): Promise<ClanEventView> {
    await this.access.officer({ clanId, userId });
    await this.sync(await this.find({ clanId, userId, id }));

    return this.view(id);
  }

  async syncFinished(now: Date): Promise<number> {
    const events = await this.prisma.clanEvent.findMany({
      where: {
        kind: { in: ['stronghold', 'clanWars'] },
        endsAt: { lte: new Date(now.getTime() - CLAN_WORKSPACE.snapshotSlackMs / 4), gte: new Date(now.getTime() - CLAN_WORKSPACE.syncLookbackMs) }
      }
    });

    let synced = 0;

    for (const event of events) {
      if (!eventDataSchema.parse(event.data).attendanceSyncedAt) {
        synced += (await this.sync(event)) > 0 ? 1 : 0;
      }
    }

    return synced;
  }

  async sendReminders(now: Date): Promise<number> {
    const due = await this.prisma.clanEvent.findMany({
      where: { remindAt: { lte: now }, remindedAt: null, startsAt: { gt: now } },
      include: { workspace: { include: { clan: { select: { tag: true } } } } }
    });

    for (const event of due) {
      const claimed = await this.prisma.clanEvent.updateMany({ where: { id: event.id, remindedAt: null }, data: { remindedAt: now } });

      if (claimed.count === 0) {
        continue;
      }

      const userIds = await this.access.userIdsOf({ clanId: event.clanId, officersOnly: false });

      await this.notifications.notifyMany({
        userIds,
        dedupeKey: `clan-event-${event.id}`,
        notification: {
          event: 'clanEventReminder',
          clanId: Number(event.clanId),
          clanTag: event.workspace.clan.tag,
          title: event.title,
          startsAt: event.startsAt.toISOString(),
          report: null
        }
      });
    }

    return due.length;
  }

  private async sync(event: ClanEvent): Promise<number> {
    const modes = ATTENDANCE_MODES[event.kind];
    const endsAt = event.endsAt ?? new Date(event.startsAt.getTime() + CLAN_WORKSPACE.defaultEventHours * 3_600_000);

    if (modes.length === 0) {
      return 0;
    }

    const members = await this.prisma.clanMember.findMany({ where: { clanId: event.clanId }, select: { accountId: true } });
    const snapshots = await this.prisma.accountSnapshot.findMany({
      where: {
        accountId: { in: members.map((member) => member.accountId) },
        mode: { in: [...modes] },
        capturedAt: {
          gte: new Date(event.startsAt.getTime() - CLAN_WORKSPACE.snapshotSlackMs),
          lte: new Date(endsAt.getTime() + CLAN_WORKSPACE.snapshotSlackMs)
        }
      },
      select: { accountId: true, capturedAt: true, battles: true, mode: true }
    });

    const totals = new Map<string, BattleSample>();

    for (const snapshot of snapshots) {
      const key = `${snapshot.accountId}:${snapshot.capturedAt.getTime()}`;
      const current = totals.get(key);

      totals.set(key, { accountId: snapshot.accountId, capturedAt: snapshot.capturedAt, battles: (current?.battles ?? 0) + snapshot.battles });
    }

    const attended = attendedAccounts({ samples: [...totals.values()], startsAt: event.startsAt, endsAt });
    const manual = await this.prisma.clanAttendance.findMany({
      where: { eventId: event.id, source: 'manual', status: { in: ['attended', 'absent'] } },
      select: { accountId: true }
    });

    const locked = new Set(manual.map((row) => row.accountId));
    const writes = [...attended.entries()].filter(([accountId]) => !locked.has(accountId));

    await this.prisma.$transaction([
      ...writes.map(([accountId, present]) =>
        this.prisma.clanAttendance.upsert({
          where: { eventId_accountId: { eventId: event.id, accountId } },
          create: { eventId: event.id, accountId, status: present ? 'attended' : 'absent', source: 'api' },
          update: { status: present ? 'attended' : 'absent', source: 'api' }
        })
      ),
      this.prisma.clanEvent.update({
        where: { id: event.id },
        data: { data: toJsonValue({ ...eventDataSchema.parse(event.data), attendanceSyncedAt: new Date().toISOString() }) }
      })
    ]);

    this.logger.debug(`attendance for ${event.id}: ${writes.length} members`);

    return writes.length;
  }

  private async find({ clanId, id }: ClanItemScope): Promise<ClanEvent> {
    const event = await this.prisma.clanEvent.findFirst({ where: { id, clanId: BigInt(clanId) } });

    if (!event) {
      throw new AppNotFoundException('NOT_FOUND', `No event ${id} in clan ${clanId}`);
    }

    return event;
  }

  private async view(id: string): Promise<ClanEventView> {
    const event = await this.prisma.clanEvent.findUniqueOrThrow({ where: { id }, include: { attendance: true } });
    const nicknames = await this.access.nicknames(event.attendance.map((row) => row.accountId));

    return toClanEventView({ event, nicknames });
  }
}
