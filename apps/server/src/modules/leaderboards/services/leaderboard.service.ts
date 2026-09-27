import type { Leaderboard, LeaderboardQuery } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { RankedRow } from '../leaderboards.types';

import { toNumber } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { LEADERBOARD_MIN_BATTLES, RISING_STARS } from '../config';
import { toLeaderboardEntry } from '../mappers';
import { clansSql, marksSql, playersSql, risingStarsSql, streamersFilterSql, tankPlayersSql } from '../queries';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async leaderboard(query: LeaderboardQuery): Promise<Leaderboard> {
    const minBattles = this.minBattles(query);
    const sql = match(query.scope)
      .with('players', () => (query.tankId || query.tier || query.type ? tankPlayersSql({ query, minBattles }) : playersSql({ query, minBattles })))
      .with('clans', () => clansSql(query))
      .with('risingStars', () => {
        const period = this.risingStarsPeriod(query);

        return risingStarsSql({ query, period, minBattles: query.minBattles ?? LEADERBOARD_MIN_BATTLES[period] });
      })
      .with('marks', () => marksSql(query))
      .with('streamers', () => playersSql({ query, minBattles, filter: streamersFilterSql }))
      .exhaustive();

    const rows = await this.prisma.$queryRaw<RankedRow[]>(sql);
    const scale = query.scope === 'clans' || query.scope === 'marks' ? null : query.metric;

    return {
      scope: query.scope,
      metric: query.metric,
      period: query.period,
      total: rows[0] ? toNumber(rows[0].total) : 0,
      minBattles: this.appliedMinBattles(query),
      entries: rows.map((row, index) => toLeaderboardEntry({ row, rank: query.offset + index + 1, scale }))
    };
  }

  private appliedMinBattles(query: LeaderboardQuery): number | null {
    return match(query.scope)
      .with('clans', 'marks', () => null)
      .with('risingStars', () => query.minBattles ?? LEADERBOARD_MIN_BATTLES[this.risingStarsPeriod(query)])
      .with('players', 'streamers', () => this.minBattles(query))
      .exhaustive();
  }

  private risingStarsPeriod(query: LeaderboardQuery) {
    return query.period === 'overall' ? RISING_STARS.fallbackPeriod : query.period;
  }

  private minBattles(query: LeaderboardQuery): number {
    return query.minBattles ?? LEADERBOARD_MIN_BATTLES[query.period];
  }
}
