import type { PlayerAchievements } from '@bronevik/schemas';

import { Inject, Injectable } from '@nestjs/common';

import type { LestaClient } from '../../../lib/lesta';

import { LESTA_CLIENT, PrismaService } from '../../../core';
import { playerAchievements } from '../lib';

@Injectable()
export class PlayerAchievementsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENT) private readonly lesta: LestaClient
  ) {}

  async achievements(accountId: bigint): Promise<PlayerAchievements> {
    const key = accountId.toString();

    const [byAccount, catalog] = await Promise.all([
      this.lesta.account.achievements({ accountIds: [key] }),
      this.prisma.achievement.findMany({ select: { name: true, section: true, title: true, description: true, image: true, order: true } })
    ]);

    const entry = byAccount[key];

    return { items: entry ? playerAchievements({ counts: entry.achievements, maxSeries: entry.max_series, catalog }) : [] };
  }
}
