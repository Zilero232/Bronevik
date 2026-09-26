import type { ClanMember, ClanMemberEvent, ClanPage, Paginated } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';
import { differenceInDays } from 'date-fns';

import type { ClanEventsInput } from '../clans.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { clampPercent, CLAN_ROLE_FROM_DB, emptyRating, ratingValue, toIso, toNumber } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { CLAN_PAGE } from '../config';
import { toClanSummary } from '../lib';

@Injectable()
export class ClanPageService {
  constructor(private readonly prisma: PrismaService) {}

  async page(clanId: bigint): Promise<ClanPage> {
    const clan = await this.prisma.clan.findUnique({ where: { clanId }, include: { stronghold: true } });

    if (!clan) {
      throw new AppNotFoundException('CLAN_NOT_FOUND', `No clan with id ${clanId}`);
    }

    const [snapshot, provincesCount, members, events] = await Promise.all([
      this.prisma.clanSnapshot.findFirst({ where: { clanId }, orderBy: { capturedAt: 'desc' } }),
      this.prisma.globalMapProvince.count({ where: { ownerClanId: clanId } }),
      this.members(clanId),
      this.events({ clanId, limit: CLAN_PAGE.recentEvents, offset: 0 })
    ]);

    return {
      clan: toClanSummary(clan),
      stats: {
        avgWinRate: clampPercent(snapshot?.avgWinRate),
        avgWn8: ratingValue({ kind: 'wn8', value: snapshot?.avgWn8 }),
        avgBattlesPerDay: null,
        activeMembers7d: snapshot?.activeMembers7d ?? null,
        eloRating10: snapshot?.eloRating10 ?? null,
        strongholdLevel: clan.stronghold?.level ?? null,
        provincesCount
      },
      members,
      recentEvents: events.items,
      updatedAt: (clan.lastPolledAt ?? clan.updatedAt).toISOString()
    };
  }

  async members(clanId: bigint): Promise<ClanMember[]> {
    const rows = await this.prisma.clanMember.findMany({
      where: { clanId },
      include: {
        player: {
          select: {
            nickname: true,
            lastBattleAt: true,
            ratings: { where: { period: { in: ['overall', CLAN_PAGE.recentPeriod] } } }
          }
        }
      }
    });

    const now = new Date();

    return rows.map((row) => {
      const overall = row.player.ratings.find((rating) => rating.period === 'overall');
      const recent = row.player.ratings.find((rating) => rating.period === CLAN_PAGE.recentPeriod);
      const lastBattleAt = row.player.lastBattleAt;

      return {
        accountId: toNumber(row.accountId),
        nickname: row.player.nickname,
        role: CLAN_ROLE_FROM_DB[row.role],
        joinedAt: toIso(row.joinedAt),
        lastBattleAt: toIso(lastBattleAt),
        inactiveDays: lastBattleAt ? Math.max(0, differenceInDays(now, lastBattleAt)) : null,
        battles: overall?.battles ?? null,
        winRate: clampPercent(overall?.winRate),
        wn8: overall ? ratingValue({ kind: 'wn8', value: overall.wn8 }) : emptyRating(),
        recentWn8: recent ? ratingValue({ kind: 'wn8', value: recent.wn8 }) : emptyRating()
      };
    });
  }

  async events({ clanId, limit, offset }: ClanEventsInput): Promise<Paginated<ClanMemberEvent>> {
    const [rows, total] = await Promise.all([
      this.prisma.clanMemberEvent.findMany({ where: { clanId }, orderBy: { occurredAt: 'desc' }, take: limit, skip: offset }),
      this.prisma.clanMemberEvent.count({ where: { clanId } })
    ]);

    const players = await this.prisma.player.findMany({
      where: { accountId: { in: rows.map((row) => row.accountId) } },
      select: { accountId: true, nickname: true }
    });

    const nicknameOf = new Map(players.map((player) => [player.accountId, player.nickname]));

    return {
      items: rows.map((row) => ({
        accountId: toNumber(row.accountId),
        nickname: nicknameOf.get(row.accountId) ?? null,
        type: row.type === 'roleChanged' ? 'role_changed' : row.type,
        oldRole: row.oldRole ? CLAN_ROLE_FROM_DB[row.oldRole] : null,
        newRole: row.newRole ? CLAN_ROLE_FROM_DB[row.newRole] : null,
        occurredAt: row.occurredAt.toISOString()
      })),
      total,
      limit,
      offset
    };
  }
}
