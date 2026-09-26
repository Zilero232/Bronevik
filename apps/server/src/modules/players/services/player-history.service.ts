import type { PlayerActivity, PlayerHistoryEntry, TimeSeries, TimeSeriesQuery } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { sortBy } from 'remeda';

import type { BucketTankRow } from '../lib';
import type { ActivityInput, ActivityRow, HistoryInput } from '../players.types';

import { percentOf, toIso } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { BronyaReferencesService, ExpectedValuesService, VehicleCatalogService } from '../../reference';
import { HISTORY } from '../config';
import { moscowDay, moscowDayStart, seriesPoints } from '../lib';

@Injectable()
export class PlayerHistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly expected: ExpectedValuesService,
    private readonly bronya: BronyaReferencesService
  ) {}

  async series({ accountId, query }: HistoryInput): Promise<TimeSeries> {
    const { from, to } = this.window(query);

    const [rows, expected, tiers, patches, references] = await Promise.all([
      this.prisma.$queryRaw<BucketTankRow[]>`
        SELECT (date_trunc(${query.granularity}, captured_at AT TIME ZONE 'Europe/Moscow') AT TIME ZONE 'Europe/Moscow') AS bucket,
               tank_id,
               sum(battles)::float8 AS battles,
               sum(wins)::float8 AS wins,
               sum(damage_dealt)::float8 AS damage,
               sum(frags)::float8 AS frags,
               sum(spotted)::float8 AS spotted,
               sum(dropped_capture_points)::float8 AS def,
               sum(capture_points)::float8 AS cap
        FROM tank_battle_delta
        WHERE account_id = ${accountId} AND mode = 'random'::stats_mode AND captured_at >= ${from} AND captured_at < ${to}
        GROUP BY 1, 2
      `,
      this.expected.all(),
      this.catalog.tiers(),
      this.prisma.gameVersion.findMany({ where: { releasedAt: { gte: from, lt: to } }, orderBy: { releasedAt: 'asc' } }),
      query.metric === 'broneIndex' ? this.bronya.all() : Promise.resolve(new Map())
    ]);

    return {
      metric: query.metric,
      granularity: query.granularity,
      points: seriesPoints({ rows, metric: query.metric, expected, tiers, references }),
      markers: patches.flatMap((patch) =>
        patch.releasedAt ? [{ at: patch.releasedAt.toISOString(), kind: 'patch' as const, label: patch.title ?? patch.version }] : []
      )
    };
  }

  async activity({ accountId, days }: ActivityInput): Promise<PlayerActivity> {
    const to = new Date();
    const from = moscowDayStart(subDays(to, days - 1));

    const rows = await this.prisma.$queryRaw<ActivityRow[]>`
      SELECT to_char(captured_at AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD') AS day,
             sum(battles)::float8 AS battles,
             sum(wins)::float8 AS wins
      FROM tank_battle_delta
      WHERE account_id = ${accountId} AND mode = 'random'::stats_mode AND captured_at >= ${from}
      GROUP BY 1
      ORDER BY 1
    `;

    return {
      from: moscowDay(from),
      to: moscowDay(to),
      days: rows.map((row) => ({ date: row.day, battles: row.battles, winRate: percentOf({ value: row.wins, by: row.battles }) }))
    };
  }

  async nicknames(accountId: bigint): Promise<PlayerHistoryEntry[]> {
    const [nicknames, clans] = await Promise.all([
      this.prisma.playerNickname.findMany({ where: { accountId }, orderBy: { firstSeenAt: 'desc' } }),
      this.prisma.playerClanHistory.findMany({ where: { accountId }, orderBy: { joinedAt: 'desc' } })
    ]);

    const tags = await this.prisma.clan.findMany({
      where: { clanId: { in: clans.map((entry) => entry.clanId) } },
      select: { clanId: true, tag: true }
    });

    const tagOf = new Map(tags.map((clan) => [clan.clanId, clan.tag]));

    const entries: PlayerHistoryEntry[] = [
      ...nicknames.map((entry) => ({
        kind: 'nickname' as const,
        value: entry.nickname,
        from: toIso(entry.firstSeenAt),
        to: toIso(entry.lastSeenAt)
      })),
      ...clans.map((entry) => ({
        kind: 'clan' as const,
        value: tagOf.get(entry.clanId) ?? String(entry.clanId),
        from: toIso(entry.joinedAt),
        to: toIso(entry.leftAt)
      }))
    ];

    return sortBy(entries, [(entry) => entry.from ?? '', 'desc']);
  }

  private window(query: TimeSeriesQuery) {
    const to = query.to ? new Date(query.to) : new Date();
    const earliest = subDays(to, HISTORY.maxDays);
    const requested = query.from ? new Date(query.from) : subDays(to, HISTORY.defaultDays);

    return { from: requested < earliest ? earliest : requested, to };
  }
}
