import type { ClanStronghold } from '@bronevik/schemas';

import { Inject, Injectable, Logger } from '@nestjs/common';

import type { LestaClient } from '../../../lib/lesta';

import { readNumber, readRecord, toJsonValue, toNumber } from '../../../common/lib';
import { LESTA_CLIENT, PrismaService } from '../../../core';
import { STRONGHOLD_FETCH } from '../config';
import { toStronghold } from '../lib';

@Injectable()
export class ClanStrongholdService {
  private readonly logger = new Logger(ClanStrongholdService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENT) private readonly lesta: LestaClient
  ) {}

  async stronghold(clanId: bigint): Promise<ClanStronghold> {
    const [stored, snapshot, provinces] = await Promise.all([
      this.prisma.clanStronghold.findUnique({ where: { clanId } }),
      this.prisma.clanSnapshot.findFirst({
        where: { clanId },
        orderBy: { capturedAt: 'desc' },
        select: { eloRating6: true, eloRating8: true, eloRating10: true }
      }),
      this.prisma.globalMapProvince.findMany({
        where: { ownerClanId: clanId },
        orderBy: { name: 'asc' },
        select: { provinceId: true, name: true, arenaId: true, dailyRevenue: true }
      })
    ]);

    const row = stored ?? (await this.fetch(clanId));

    return toStronghold({
      clanId: toNumber(clanId),
      level: row?.level ?? null,
      stats: row?.stats ?? null,
      buildings: row?.buildings ?? null,
      reserves: row?.reserves ?? null,
      updatedAt: row?.updatedAt ?? null,
      elo: {
        eloRating6: snapshot?.eloRating6 ?? null,
        eloRating8: snapshot?.eloRating8 ?? null,
        eloRating10: snapshot?.eloRating10 ?? null
      },
      provinces
    });
  }

  private async fetch(clanId: bigint) {
    try {
      const response = await this.lesta.stronghold.claninfo({ ids: [Number(clanId)] });
      const info = response[String(clanId)];

      if (!info) {
        return null;
      }

      const record = readRecord(info);
      const level = STRONGHOLD_FETCH.levelKeys.map((key) => readNumber(record[key])).find((value) => value !== null) ?? null;

      return await this.prisma.clanStronghold.upsert({
        where: { clanId },
        create: { clanId, level, stats: toJsonValue(info) },
        update: { level, stats: toJsonValue(info) }
      });
    } catch (error) {
      this.logger.warn(`stronghold of clan ${clanId} not fetched: ${error instanceof Error ? error.message : String(error)}`);

      return null;
    }
  }
}
