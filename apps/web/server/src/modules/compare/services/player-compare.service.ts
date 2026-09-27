import type { PlayerComparison } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { ComparePlayersInput } from '../compare.types';

import { PrismaService } from '../../../core';
import { PlayerResolverService, PlayerSummaryService } from '../../players';

@Injectable()
export class PlayerCompareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resolver: PlayerResolverService,
    private readonly summaries: PlayerSummaryService
  ) {}

  async compare({ accountIds }: ComparePlayersInput): Promise<PlayerComparison> {
    const resolved = await Promise.all(accountIds.map((accountId) => this.resolver.ensure(BigInt(accountId))));
    const players = await Promise.all(resolved.map((accountId) => this.summaries.profile(accountId)));

    const tanks = await this.prisma.playerTank.findMany({
      where: { accountId: { in: resolved }, battles: { gt: 0 } },
      select: { accountId: true, tankId: true }
    });

    const owners = new Map<number, Set<bigint>>();

    for (const tank of tanks) {
      const set = owners.get(tank.tankId) ?? new Set<bigint>();

      set.add(tank.accountId);
      owners.set(tank.tankId, set);
    }

    const commonTankIds = [...owners.entries()].filter(([, set]) => set.size === resolved.length).map(([tankId]) => tankId);

    return { players, commonTankIds };
  }
}
