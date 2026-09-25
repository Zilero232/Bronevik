import type { Playtime } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { sumBy } from 'remeda';

import type { PlaytimeResultInput, PlaytimeRow, PlaytimeWindowInput } from '../players.types';

import { PrismaService } from '../../../core';
import { PLAYTIME, playtimeCells } from '../lib';

@Injectable()
export class PlayerPlaytimeService {
  constructor(private readonly prisma: PrismaService) {}

  async playtime(accountId: bigint): Promise<Playtime> {
    const from = subDays(new Date(), PLAYTIME.windowDays);
    const battles = await this.fromBattles({ accountId, from });

    if (battles.length > 0) {
      return this.toPlaytime({ rows: battles, source: 'battles' });
    }

    const snapshots = await this.fromSnapshots({ accountId, from });

    return this.toPlaytime({ rows: snapshots, source: snapshots.length > 0 ? 'snapshots' : 'none' });
  }

  private toPlaytime({ rows, source }: PlaytimeResultInput): Playtime {
    return { battles: Math.round(sumBy(rows, (row) => row.battles)), source, cells: playtimeCells(rows) };
  }

  private async fromBattles({ accountId, from }: PlaytimeWindowInput): Promise<PlaytimeRow[]> {
    return this.prisma.$queryRaw<PlaytimeRow[]>`
      SELECT (extract(isodow FROM started_at AT TIME ZONE ${PLAYTIME.timeZone}) - 1)::int AS weekday,
             extract(hour FROM started_at AT TIME ZONE ${PLAYTIME.timeZone})::int AS hour,
             count(*)::float8 AS battles,
             count(*) FILTER (WHERE result = 'win'::battle_result)::float8 AS wins,
             sum(damage_dealt)::float8 AS damage
      FROM battle
      WHERE account_id = ${accountId} AND started_at >= ${from}
      GROUP BY 1, 2
    `;
  }

  private async fromSnapshots({ accountId, from }: PlaytimeWindowInput): Promise<PlaytimeRow[]> {
    return this.prisma.$queryRaw<PlaytimeRow[]>`
      SELECT (extract(isodow FROM captured_at AT TIME ZONE ${PLAYTIME.timeZone}) - 1)::int AS weekday,
             extract(hour FROM captured_at AT TIME ZONE ${PLAYTIME.timeZone})::int AS hour,
             sum(battles)::float8 AS battles,
             sum(wins)::float8 AS wins,
             sum(damage_dealt)::float8 AS damage
      FROM tank_battle_delta
      WHERE account_id = ${accountId} AND mode = 'random'::stats_mode AND captured_at >= ${from}
      GROUP BY 1, 2
    `;
  }
}
