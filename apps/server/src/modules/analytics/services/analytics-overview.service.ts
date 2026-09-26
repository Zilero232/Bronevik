import type { AnalyticsOverview, SessionCompareRow } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { PlaytimeRow } from '../../players';
import type { AnalyticsInput, PeriodWindow, SessionsInput, TrendInput, TrendRow, WindowInput } from '../analytics.types';
import type { RawTankRow } from '../lib';

import { percentOf } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { ExpectedValuesService, VehicleCatalogService } from '../../reference';
import { ANALYTICS_SQL, ANALYTICS_WINDOW } from '../config';
import { breakdown, periodStart, splitPlaytime, statLine, tilt, toAggregateRow, trendGranularity, trendPoints } from '../lib';
import { OwnAccountService } from './own-account.service';

@Injectable()
export class AnalyticsOverviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly expected: ExpectedValuesService,
    private readonly accounts: OwnAccountService
  ) {}

  async overview({ userId, account, period }: AnalyticsInput): Promise<AnalyticsOverview> {
    const accountId = await this.accounts.resolve({ userId, account });
    const window: PeriodWindow = { accountId, period, from: periodStart({ period, now: new Date() }) };

    const [tankRows, trendRows, modBattles, expected, catalog] = await Promise.all([
      this.tankTotals(window),
      this.trend({ ...window, granularity: trendGranularity(period) }),
      this.prisma.battle.findMany({
        where: { accountId, battleType: ANALYTICS_SQL.randomBattleType, ...(window.from ? { startedAt: { gte: window.from } } : {}) },
        orderBy: { startedAt: 'asc' },
        select: { result: true, startedAt: true }
      }),
      this.expected.all(),
      this.catalog.all()
    ]);

    const rows = tankRows.map(toAggregateRow);
    const totals = statLine({ rows, expected });
    const vehicles = new Map([...catalog.values()].map((entry) => [entry.summary.tankId, entry.summary]));
    const playtime = modBattles.length > 0 ? await this.battlePlaytime(window) : await this.deltaPlaytime(window);

    return {
      accountId: Number(accountId),
      period,
      modBattles: modBattles.length,
      totals,
      breakdown: breakdown({ rows, expected, vehicles }),
      ...splitPlaytime(playtime),
      trend: trendPoints({ rows: trendRows.map((row) => ({ ...toAggregateRow(row), bucket: row.bucket })), expected }),
      tilt: tilt(modBattles),
      sessions: await this.sessions({ window, totals })
    };
  }

  async tankTotals({ accountId, from }: WindowInput): Promise<RawTankRow[]> {
    return this.prisma.$queryRaw<RawTankRow[]>`
      SELECT tank_id,
             sum(battles)::float8 AS battles, sum(wins)::float8 AS wins, sum(damage_dealt)::float8 AS damage,
             sum(frags)::float8 AS frags, sum(spotted)::float8 AS spotted, sum(capture_points)::float8 AS cap,
             sum(dropped_capture_points)::float8 AS def, sum(survived_battles)::float8 AS survived
      FROM tank_battle_delta
      WHERE account_id = ${accountId} AND mode = 'random'::stats_mode AND captured_at >= ${from ?? ANALYTICS_SQL.epoch}
      GROUP BY tank_id
    `;
  }

  async trend({ accountId, from, granularity, tankId }: TrendInput): Promise<TrendRow[]> {
    return this.prisma.$queryRaw<TrendRow[]>`
      SELECT (date_trunc(${granularity}, captured_at AT TIME ZONE ${ANALYTICS_WINDOW.timeZone}) AT TIME ZONE ${ANALYTICS_WINDOW.timeZone}) AS bucket,
             tank_id,
             sum(battles)::float8 AS battles, sum(wins)::float8 AS wins, sum(damage_dealt)::float8 AS damage,
             sum(frags)::float8 AS frags, sum(spotted)::float8 AS spotted, sum(capture_points)::float8 AS cap,
             sum(dropped_capture_points)::float8 AS def, sum(survived_battles)::float8 AS survived
      FROM tank_battle_delta
      WHERE account_id = ${accountId} AND mode = 'random'::stats_mode AND captured_at >= ${from ?? ANALYTICS_SQL.epoch}
        AND (${tankId ?? null}::int IS NULL OR tank_id = ${tankId ?? null}::int)
      GROUP BY 1, 2
    `;
  }

  private async battlePlaytime({ accountId, from }: WindowInput): Promise<PlaytimeRow[]> {
    return this.prisma.$queryRaw<PlaytimeRow[]>`
      SELECT extract(dow FROM started_at AT TIME ZONE ${ANALYTICS_WINDOW.timeZone})::int AS weekday,
             extract(hour FROM started_at AT TIME ZONE ${ANALYTICS_WINDOW.timeZone})::int AS hour,
             count(*)::float8 AS battles,
             count(*) FILTER (WHERE result = 'win'::battle_result)::float8 AS wins,
             sum(damage_dealt)::float8 AS damage
      FROM battle
      WHERE account_id = ${accountId} AND battle_type = ${ANALYTICS_SQL.randomBattleType} AND started_at >= ${from ?? ANALYTICS_SQL.epoch}
      GROUP BY 1, 2
    `;
  }

  private async deltaPlaytime({ accountId, from }: WindowInput): Promise<PlaytimeRow[]> {
    return this.prisma.$queryRaw<PlaytimeRow[]>`
      SELECT extract(dow FROM captured_at AT TIME ZONE ${ANALYTICS_WINDOW.timeZone})::int AS weekday,
             extract(hour FROM captured_at AT TIME ZONE ${ANALYTICS_WINDOW.timeZone})::int AS hour,
             sum(battles)::float8 AS battles,
             sum(wins)::float8 AS wins,
             sum(damage_dealt)::float8 AS damage
      FROM tank_battle_delta
      WHERE account_id = ${accountId} AND mode = 'random'::stats_mode AND captured_at >= ${from ?? ANALYTICS_SQL.epoch}
      GROUP BY 1, 2
    `;
  }

  private async sessions({ window, totals }: SessionsInput): Promise<SessionCompareRow[]> {
    const sessions = await this.prisma.playSession.findMany({
      where: { accountId: window.accountId, battles: { gt: 0 }, ...(window.from ? { startedAt: { gte: window.from } } : {}) },
      orderBy: { startedAt: 'desc' },
      take: ANALYTICS_WINDOW.sessions,
      select: { id: true, startedAt: true, battles: true, wins: true, damageDealt: true, wn8: true }
    });

    return sessions.map((session) => {
      const winRate = percentOf({ value: session.wins, by: session.battles });
      const avgDamage = session.damageDealt / session.battles;

      return {
        id: session.id,
        startedAt: session.startedAt.toISOString(),
        battles: session.battles,
        winRate,
        avgDamage,
        wn8: session.wn8,
        winRateDelta: winRate === null || totals.winRate === null ? null : winRate - totals.winRate,
        avgDamageDelta: totals.avgDamage === null ? null : avgDamage - totals.avgDamage
      };
    });
  }
}
