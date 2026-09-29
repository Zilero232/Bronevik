import type { Playtime } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { PlaytimeRow } from '../players.types';

import { PrismaService } from '../../../core';
import { PLAYTIME } from '../lib';
import { toPlaytime } from '../mappers';
import { playtimeFromBattlesSql, playtimeFromSnapshotsSql } from '../queries';

@Injectable()
export class PlayerPlaytimeService {
  constructor(private readonly prisma: PrismaService) {}

  async playtime(accountId: bigint): Promise<Playtime> {
    const from = subDays(new Date(), PLAYTIME.windowDays);
    const battles = await this.prisma.$queryRaw<PlaytimeRow[]>(playtimeFromBattlesSql({ accountId, from }));

    if (battles.length > 0) {
      return toPlaytime({ rows: battles, source: 'battles' });
    }

    const snapshots = await this.prisma.$queryRaw<PlaytimeRow[]>(playtimeFromSnapshotsSql({ accountId, from }));

    return toPlaytime({ rows: snapshots, source: snapshots.length > 0 ? 'snapshots' : 'none' });
  }
}
