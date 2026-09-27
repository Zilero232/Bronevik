import { Inject, Injectable, Logger } from '@nestjs/common';
import { startOfHour, subDays, subHours } from 'date-fns';

import type { LestaClients, WebhookEmitter } from '../../../../core';
import type { ClanRefreshPayload } from '../../contracts';
import type { ClanActivityInput, ClanFieldsInput, ClanSnapshotInput, LestaOrEmptyInput, ReplaceProvincesInput, SyncClanInput } from '../clans.types';
import type { CurrentMember } from '../lib/clan-roster';
import type { ClanActivityRow } from '../queries';

import { clanInfoFields, errorMessage, readNumber, readRecord, toJsonValue } from '../../../../common/lib';
import { LESTA_CLIENTS, PrismaService, WEBHOOK_EMITTER } from '../../../../core';
import { PurgeGuardService } from '../../purge';
import { CLANS } from '../config';
import { ownedProvinces } from '../lib/clan-provinces';
import { clanMemberEvents, diffClanRoster, rosterChanges } from '../lib/clan-roster';
import { toCurrentMember, toPopulationPlayer } from '../mappers';
import { clanActivitySql } from '../queries';

@Injectable()
export class ClanSyncService {
  private readonly logger = new Logger(ClanSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly guard: PurgeGuardService,
    @Inject(LESTA_CLIENTS) private readonly clients: LestaClients,
    @Inject(WEBHOOK_EMITTER) private readonly webhooks: WebhookEmitter
  ) {}

  async refresh({ clanIds, snapshot }: ClanRefreshPayload) {
    const infos = await this.clients.bulk.clans.info({ clanIds });
    const now = new Date();
    let events = 0;

    for (const clanId of clanIds) {
      const info = infos[String(clanId)] ?? null;

      events += await this.syncClan({ clanId, info, now });
    }

    if (snapshot) {
      await this.snapshot({ clanIds, infos, now });
    }

    return { clans: clanIds.length, events };
  }

  private async syncClan({ clanId, info, now }: SyncClanInput): Promise<number> {
    const id = BigInt(clanId);
    const exists = await this.prisma.clan.findUnique({ where: { clanId: id }, select: { clanId: true } });

    if (!info && !exists) {
      return 0;
    }

    const disbanded = !info || info.is_clan_disbanded === true;
    const members = disbanded ? [] : (info.members ?? []);
    const blocked = await this.guard.blocked(members.map((member) => member.account_id));
    const allowed = members.filter((member) => !blocked.has(member.account_id));

    const current: CurrentMember[] = allowed.map(toCurrentMember);

    const stored = await this.prisma.clanMember.findMany({ where: { clanId: id }, select: { accountId: true, role: true } });
    const diff = diffClanRoster({ stored, current });
    const events = exists ? clanMemberEvents({ clanId: id, diff, now }) : [];
    const names = new Map(allowed.map((member) => [member.account_id, member.account_name]));
    const changed = [...diff.joined, ...current.filter((member) => diff.roleChanged.some((change) => change.accountId === member.accountId))];

    await this.prisma.$transaction(async (tx) => {
      const clan = this.clanFields({ info, disbanded, membersCount: current.length, now });

      await tx.clan.upsert({ where: { clanId: id }, create: { clanId: id, tag: info?.tag ?? '', name: info?.name ?? '', ...clan }, update: clan });

      await tx.player.createMany({
        data: diff.joined.map((member) => toPopulationPlayer({ member, nickname: names.get(Number(member.accountId)), clanId: id })),
        skipDuplicates: true
      });

      await tx.player.updateMany({ where: { accountId: { in: diff.joined.map((member) => member.accountId) } }, data: { clanId: id } });
      await tx.player.updateMany({ where: { accountId: { in: diff.left }, clanId: id }, data: { clanId: null } });
      await tx.clanMember.deleteMany({ where: { clanId: id, accountId: { in: diff.left } } });

      for (const member of changed) {
        const data = { clanId: id, role: member.role, joinedAt: member.joinedAt };

        await tx.clanMember.upsert({ where: { accountId: member.accountId }, create: { accountId: member.accountId, ...data }, update: data });
      }

      await tx.clanMemberEvent.createMany({ data: events });
    });

    if (events.length > 0) {
      const changes = rosterChanges(events);

      await this.webhooks.emit({
        event: 'clan.member_changed',
        subject: { accountIds: changes.map((change) => change.accountId), clanIds: [clanId] },
        data: { clanId, tag: info?.tag ?? null, changes }
      });
    }

    return events.length;
  }

  private clanFields({ info, disbanded, membersCount, now }: ClanFieldsInput) {
    return {
      ...(info ? clanInfoFields(info) : {}),
      membersCount,
      isDisbanded: disbanded,
      lastPolledAt: now
    };
  }

  private async snapshot({ clanIds, infos, now }: ClanSnapshotInput) {
    const capturedAt = startOfHour(now);
    const live = clanIds.filter((clanId) => infos[String(clanId)]);

    if (live.length === 0) {
      return;
    }

    const [globalmap, stronghold, provinces, activity] = await Promise.all([
      this.lestaOrEmpty({ method: 'globalmap/claninfo', call: () => this.clients.bulk.globalmap.claninfo({ ids: live }) }),
      this.lestaOrEmpty({ method: 'stronghold/claninfo', call: () => this.clients.bulk.stronghold.claninfo({ ids: live }) }),
      this.lestaOrEmpty({ method: 'globalmap/clanprovinces', call: () => this.clients.bulk.globalmap.clanprovinces({ ids: live }) }),
      this.activity({ clanIds: live, now })
    ]);

    for (const clanId of live) {
      const id = BigInt(clanId);
      const map = readRecord(globalmap[String(clanId)]);
      const ratings = readRecord(map.ratings);
      const fort = stronghold[String(clanId)];
      const members = activity.get(id);

      await this.prisma.clanSnapshot.upsert({
        where: { clanId_capturedAt: { clanId: id, capturedAt } },
        create: {
          clanId: id,
          capturedAt,
          membersCount: infos[String(clanId)]?.members_count ?? 0,
          activeMembers7d: members?.activeMembers7d ?? null,
          avgWinRate: members?.avgWinRate ?? null,
          avgWn8: members?.avgWn8 ?? null,
          battlesDelta: members?.battlesDelta ?? null,
          eloRating6: readNumber(ratings[CLANS.eloKeys.eloRating6]),
          eloRating8: readNumber(ratings[CLANS.eloKeys.eloRating8]),
          eloRating10: readNumber(ratings[CLANS.eloKeys.eloRating10])
        },
        update: {}
      });

      if (fort) {
        const record = readRecord(fort);
        const level = CLANS.strongholdLevelKeys.map((key) => readNumber(record[key])).find((value) => value !== null) ?? null;

        await this.prisma.clan.update({
          where: { clanId: id },
          data: { strongholdLevel: level, stronghold: toJsonValue({ stats: fort }), strongholdUpdatedAt: now }
        });
      }

      const owned = String(clanId) in provinces ? ownedProvinces(provinces[String(clanId)]) : null;

      if (owned) {
        await this.replaceProvinces({ clanId: id, provinces: owned });
      }
    }
  }

  private async activity({ clanIds, now }: ClanActivityInput): Promise<Map<bigint, ClanActivityRow>> {
    const rows = await this.prisma.$queryRaw<ClanActivityRow[]>(
      clanActivitySql({
        clanIds: clanIds.map(BigInt),
        battlesSince: subHours(now, CLANS.battlesWindowHours),
        activeSince: subDays(now, CLANS.activeMemberDays)
      })
    );

    return new Map(rows.map((row) => [row.clanId, row]));
  }

  private async replaceProvinces({ clanId, provinces }: ReplaceProvincesInput) {
    await this.prisma.$transaction([
      this.prisma.globalMapProvince.deleteMany({
        where: { ownerClanId: clanId, provinceId: { notIn: provinces.map((province) => province.provinceId) } }
      }),
      ...provinces.map((province) =>
        this.prisma.globalMapProvince.upsert({
          where: { provinceId: province.provinceId },
          create: { ...province, ownerClanId: clanId },
          update: { ...province, ownerClanId: clanId }
        })
      )
    ]);
  }

  private async lestaOrEmpty({ method, call }: LestaOrEmptyInput): Promise<Record<string, unknown>> {
    try {
      return await call();
    } catch (error) {
      this.logger.warn(`${method} failed: ${errorMessage(error)}`);

      return {};
    }
  }
}
