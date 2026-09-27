import type { Playtime } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { PlaytimeRow, PlaytimeWindowInput } from '../players.types';

import { TIME } from '../../../config';
import { PrismaService } from '../../../core';
import { PLAYTIME } from '../lib';
import { toPlaytime } from '../mappers';

@Injectable()
export class PlayerPlaytimeService {
  constructor(private readonly prisma: PrismaService) {}

  async playtime(accountId: bigint): Promise<Playtime> {
    const from = subDays(new Date(), PLAYTIME.windowDays);
    const battles = await this.fromBattles({ accountId, from });

    if (battles.length > 0) {
      return toPlaytime({ rows: battles, source: 'battles' });
    }

    const snapshots = await this.fromSnapshots({ accountId, from });

    return toPlaytime({ rows: snapshots, source: snapshots.length > 0 ? 'snapshots' : 'none' });
  }

  private async fromBattles({ accountId, from }: PlaytimeWindowInput): Promise<PlaytimeRow[]> {
    return this.prisma.$queryRaw<PlaytimeRow[]>`
      SELECT (extract(isodow FROM started_at AT TIME ZONE ${TIME.zone}) - 1)::int AS weekday,
             extract(hour FROM started_at AT TIME ZONE ${TIME.zone})::int AS hour,
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
      SELECT (extract(isodow FROM captured_at AT TIME ZONE ${TIME.zone}) - 1)::int AS weekday,
             extract(hour FROM captured_at AT TIME ZONE ${TIME.zone})::int AS hour,
             sum(battles)::float8 AS battles,
             sum(wins)::float8 AS wins,
             sum(damage_dealt)::float8 AS damage
      FROM tank_battle_delta
      WHERE account_id = ${accountId} AND mode = 'random'::stats_mode AND captured_at >= ${from}
      GROUP BY 1, 2
    `;
  }
}
