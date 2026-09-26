import { Inject, Injectable, Logger } from '@nestjs/common';

import type { LestaClient } from '../../../lib/lesta';
import type { LestaPlayerInfo } from '../players.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { errorMessage, fromUnixSeconds } from '../../../common/lib';
import { LESTA_CLIENT, PrismaService } from '../../../core';
import { CollectorProducerService } from '../../collector';
import { PLAYER_LOOKUP } from '../config';

@Injectable()
export class PlayerResolverService {
  private readonly logger = new Logger(PlayerResolverService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly collector: CollectorProducerService,
    @Inject(LESTA_CLIENT) private readonly lesta: LestaClient
  ) {}

  async resolve(idOrNick: string): Promise<bigint> {
    if (PLAYER_LOOKUP.numericId.test(idOrNick)) {
      return this.ensure(BigInt(idOrNick));
    }

    const local = await this.prisma.player.findFirst({
      where: { nickname: { equals: idOrNick, mode: 'insensitive' } },
      select: { accountId: true, isHidden: true },
      orderBy: { lastBattleAt: { sort: 'desc', nulls: 'last' } }
    });

    if (local) {
      return this.ensure(local.accountId);
    }

    const [found] = await this.lesta.account.list({ search: idOrNick, type: 'exact', limit: 1 });

    if (!found) {
      throw new AppNotFoundException('PLAYER_NOT_FOUND', `No player named ${idOrNick}`);
    }

    return this.ensure(BigInt(found.account_id));
  }

  async ensure(accountId: bigint): Promise<bigint> {
    const player = await this.prisma.player.findUnique({ where: { accountId }, select: { accountId: true, isHidden: true } });

    if (player?.isHidden) {
      throw new AppNotFoundException('LESTA_ACCOUNT_HIDDEN', 'This player asked for their data to be hidden');
    }

    if (player) {
      this.touch(accountId);

      return accountId;
    }

    const info = await this.fetchInfo(accountId);

    if (!info) {
      throw new AppNotFoundException('PLAYER_NOT_FOUND', `No player with id ${accountId}`);
    }

    await this.upsertFromLesta(info);
    await this.collector.enrol({ accountId: Number(accountId), priority: 'high', reason: 'view' });

    return accountId;
  }

  async fetchInfo(accountId: bigint): Promise<LestaPlayerInfo | null> {
    const response = await this.lesta.account.info({ accountIds: [Number(accountId)], extra: PLAYER_LOOKUP.infoExtra });
    const info = response[String(accountId)];

    return info ?? null;
  }

  async upsertFromLesta(info: LestaPlayerInfo): Promise<void> {
    const accountId = BigInt(info.account_id);
    const data = {
      nickname: info.nickname,
      clanId: info.clan_id === null ? null : BigInt(info.clan_id),
      globalRating: info.global_rating,
      createdAt: fromUnixSeconds(info.created_at),
      lastBattleAt: fromUnixSeconds(info.last_battle_time),
      logoutAt: fromUnixSeconds(info.logout_at),
      lestaUpdatedAt: fromUnixSeconds(info.updated_at)
    };

    await this.prisma.player.upsert({
      where: { accountId },
      create: { accountId, ...data },
      update: data
    });

    await this.prisma.playerNickname.upsert({
      where: { accountId_nickname: { accountId, nickname: info.nickname } },
      create: { accountId, nickname: info.nickname },
      update: { lastSeenAt: new Date() }
    });
  }

  private touch(accountId: bigint) {
    void this.prisma.player.update({ where: { accountId }, data: { lastViewedAt: new Date() } }).catch((error: unknown) => {
      this.logger.debug(`lastViewedAt of ${accountId} not updated: ${errorMessage(error)}`);
    });
  }
}
