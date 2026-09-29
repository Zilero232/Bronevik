import type { MyModeStats } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { MODE_META, PLAY_MODES } from '@otmetki/schemas';
import { subDays } from 'date-fns';
import { unique } from 'remeda';

import type { MyModeRow } from '../lib/my-mode-stats';
import type { MyModeSqlRow, MyModeStatsInput } from '../modes.types';

import { bonusTypesOfMode, gameModeOfBonusType } from '../../../common/lib';
import { PrismaService, UserLestaAccountsService } from '../../../core';
import { PlayerCareerService } from '../../players';
import { VehicleCatalogService } from '../../reference';
import { foldModeStats } from '../lib/my-mode-stats';

@Injectable()
export class MyModeStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly career: PlayerCareerService,
    private readonly lestaAccounts: UserLestaAccountsService
  ) {}

  async stats({ userId, query }: MyModeStatsInput): Promise<MyModeStats> {
    const accountId = await this.lestaAccounts.requirePrimaryAccountId({ userId, message: 'Link a Lesta account to see your own mode stats' });
    const since = subDays(new Date(), query.days);
    const types = PLAY_MODES.flatMap((mode) => bonusTypesOfMode(mode));

    const rows = await this.prisma.$queryRaw<MyModeSqlRow[]>`
      WITH own AS (
        SELECT battle_type, tank_id, result::text AS result, damage_dealt, xp, frags, survived, started_at AS played_at
        FROM battle
        WHERE account_id = ${accountId} AND battle_type = ANY(${types}::text[]) AND started_at >= ${since}
        UNION ALL
        SELECT r.battle_type, r.tank_id, r.result::text AS result, r.damage_dealt, r.xp, r.frags, NULL::boolean AS survived, r.played_at
        FROM replay r
        WHERE r.account_id = ${accountId}
          AND r.status = 'parsed'
          AND r.battle_type = ANY(${types}::text[])
          AND r.played_at >= ${since}
          AND r.tank_id IS NOT NULL
          AND r.result IS NOT NULL
          AND r.damage_dealt IS NOT NULL
          AND NOT EXISTS (SELECT 1 FROM battle b WHERE b.account_id = r.account_id AND b.arena_unique_id = r.arena_unique_id)
      )
      SELECT
        battle_type AS mode_types,
        tank_id,
        count(*)::int AS battles,
        count(*) FILTER (WHERE result = 'win')::int AS wins,
        count(*) FILTER (WHERE result <> 'draw')::int AS decided,
        sum(damage_dealt)::float8 AS damage,
        sum(COALESCE(xp, 0))::float8 AS xp,
        sum(COALESCE(frags, 0))::float8 AS frags,
        count(*) FILTER (WHERE survived)::int AS survived,
        count(survived)::int AS survival_known,
        max(played_at) AS last_battle_at
      FROM own
      GROUP BY battle_type, tank_id
    `;

    const modeRows = rows.flatMap((row): MyModeRow[] => {
      const mode = gameModeOfBonusType(row.mode_types);

      return mode && mode !== 'random'
        ? [
            {
              mode,
              tankId: row.tank_id,
              battles: row.battles,
              wins: row.wins,
              decided: row.decided,
              damage: row.damage,
              xp: row.xp,
              frags: row.frags,
              survived: row.survived,
              survivalKnown: row.survival_known,
              lastBattleAt: row.last_battle_at
            }
          ]
        : [];
    });

    const vehicles = new Map(
      await Promise.all(unique(modeRows.map((row) => row.tankId)).map(async (tankId) => [tankId, await this.catalog.summary(tankId)] as const))
    );

    const career = await this.career.modes({ accountId, allowLive: false });

    return {
      accountId: Number(accountId),
      days: query.days,
      modes: foldModeStats({ rows: modeRows, vehicles, tanksLimit: MODE_META.myTanks }),
      career: career.modes
    };
  }
}
