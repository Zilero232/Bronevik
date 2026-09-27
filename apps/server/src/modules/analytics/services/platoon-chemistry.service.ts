import type { AnalyticsPlatoons, PlatoonMate } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { AnalyticsInput, MateRow, SizedRow } from '../analytics.types';

import { PrismaService } from '../../../core';
import { ExpectedValuesService } from '../../reference';
import { ANALYTICS_SQL, PLATOON_CHEMISTRY } from '../config';
import { periodStart, statLine, winRateDelta } from '../lib';
import { toAggregateRow } from '../mappers';
import { OwnAccountService } from './own-account.service';

@Injectable()
export class PlatoonChemistryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly expected: ExpectedValuesService,
    private readonly accounts: OwnAccountService
  ) {}

  async platoons({ userId, account, period }: AnalyticsInput): Promise<AnalyticsPlatoons> {
    const accountId = await this.accounts.resolve({ userId, account });
    const from = periodStart({ period, now: new Date() }) ?? ANALYTICS_SQL.epoch;

    const [sized, mates, expected] = await Promise.all([
      this.prisma.$queryRaw<SizedRow[]>`
        SELECT platoon_size > 1 AS is_platoon, tank_id,
               count(*)::float8 AS battles,
               count(*) FILTER (WHERE result = 'win'::battle_result)::float8 AS wins,
               sum(damage_dealt)::float8 AS damage, sum(frags)::float8 AS frags, sum(spotted)::float8 AS spotted,
               sum(capture_points)::float8 AS cap, sum(dropped_capture_points)::float8 AS def,
               count(*) FILTER (WHERE survived)::float8 AS survived
        FROM battle
        WHERE account_id = ${accountId} AND battle_type = ${ANALYTICS_SQL.randomBattleType} AND started_at >= ${from} AND platoon_size IS NOT NULL
        GROUP BY 1, 2
      `,
      this.prisma.$queryRaw<MateRow[]>`
        SELECT mate, tank_id,
               count(*)::float8 AS battles,
               count(*) FILTER (WHERE result = 'win'::battle_result)::float8 AS wins,
               sum(damage_dealt)::float8 AS damage, sum(frags)::float8 AS frags, sum(spotted)::float8 AS spotted,
               sum(capture_points)::float8 AS cap, sum(dropped_capture_points)::float8 AS def,
               count(*) FILTER (WHERE survived)::float8 AS survived
        FROM battle, unnest(platoon_mates) AS mate
        WHERE account_id = ${accountId} AND battle_type = ${ANALYTICS_SQL.randomBattleType} AND started_at >= ${from}
        GROUP BY 1, 2
      `,
      this.expected.all()
    ]);

    const solo = statLine({ rows: sized.filter((row) => !row.is_platoon).map(toAggregateRow), expected });
    const platoon = statLine({ rows: sized.filter((row) => row.is_platoon).map(toAggregateRow), expected });
    const mateIds = [...new Set(mates.map((row) => row.mate))];
    const players = await this.prisma.player.findMany({ where: { accountId: { in: mateIds } }, select: { accountId: true, nickname: true } });
    const nicknameOf = new Map(players.map((player) => [player.accountId, player.nickname]));

    const rows: PlatoonMate[] = mateIds.map((mate) => {
      const line = statLine({ rows: mates.filter((row) => row.mate === mate).map(toAggregateRow), expected });

      return {
        accountId: Number(mate),
        nickname: nicknameOf.get(mate) ?? null,
        ...line,
        winRateDelta: winRateDelta({ winRate: line.winRate, average: solo.winRate })
      };
    });

    return {
      accountId: Number(accountId),
      period,
      tracked: solo.battles + platoon.battles,
      solo,
      platoon,
      mates: rows.toSorted((left, right) => right.battles - left.battles).slice(0, PLATOON_CHEMISTRY.maxMates)
    };
  }
}
