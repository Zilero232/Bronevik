import { Inject, Injectable } from '@nestjs/common';
import { fromUnixTime } from 'date-fns';

import type { LestaClients } from '../../../../core';
import type { AccountBatchPayload } from '../../contracts';

import { clanRoleToDb } from '../../../../common/lib';
import { LESTA_CLIENTS, PrismaService } from '../../../../core';

@Injectable()
export class ClanHistoryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENTS) private readonly clients: LestaClients
  ) {}

  async history({ accountIds }: AccountBatchPayload) {
    const histories = await this.clients.bulk.clans.memberhistory({ accountIds });
    const known = await this.prisma.player.findMany({ where: { accountId: { in: accountIds.map(BigInt) } }, select: { accountId: true } });
    let rows = 0;

    for (const { accountId } of known) {
      const history = histories[String(accountId)];

      if (!history) {
        continue;
      }

      const entries = history.filter((entry) => entry.left_at);

      await this.prisma.$transaction([
        this.prisma.playerClanHistory.deleteMany({ where: { accountId, leftAt: { not: null } } }),
        this.prisma.playerClanHistory.createMany({
          data: entries.map((entry) => ({
            accountId,
            clanId: BigInt(entry.clan_id),
            role: entry.role ? clanRoleToDb(entry.role) : null,
            joinedAt: fromUnixTime(entry.joined_at),
            leftAt: entry.left_at ? fromUnixTime(entry.left_at) : null
          }))
        })
      ]);

      rows += entries.length;
    }

    return { accounts: known.length, rows };
  }
}
