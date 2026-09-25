import { Injectable } from '@nestjs/common';

import type { Prisma } from '../../../../generated';
import type { CloseOwnInput, CreatePlatoonRequest, PlatoonPage, PlatoonQuery } from '../community.types';

import { AppBadRequestException, AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { toPlatoonView } from '../lib/community-views';
import { CommunityAccountsService } from './community-accounts.service';

@Injectable()
export class PlatoonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: CommunityAccountsService
  ) {}

  async list({ tier, mode, hasVoice, minWn8, maxWn8, availableAt, limit, offset }: PlatoonQuery): Promise<PlatoonPage> {
    const now = new Date();
    const at = availableAt ? new Date(availableAt) : null;
    const where: Prisma.PlatoonPostWhereInput = {
      status: 'open',
      expiresAt: { gt: now },
      ...(tier === undefined ? {} : { OR: [{ tiers: { has: tier } }, { tiers: { isEmpty: true } }] }),
      ...(mode ? { modes: { has: mode } } : {}),
      ...(hasVoice === undefined ? {} : { hasVoice }),
      ...(at
        ? {
            AND: [
              { OR: [{ availableFrom: null }, { availableFrom: { lte: at } }] },
              { OR: [{ availableUntil: null }, { availableUntil: { gte: at } }] }
            ]
          }
        : {})
    };

    const rows = await this.prisma.platoonPost.findMany({ where, orderBy: { createdAt: 'desc' } });
    const [stats, nicknames] = await Promise.all([
      this.accounts.statsOf(rows.map((row) => row.accountId)),
      this.accounts.nicknamesOf(rows.map((row) => row.accountId))
    ]);

    const filtered = rows.filter((row) => {
      const wn8 = stats.get(row.accountId)?.wn8 ?? null;

      return (minWn8 === undefined || (wn8 !== null && wn8 >= minWn8)) && (maxWn8 === undefined || (wn8 !== null && wn8 <= maxWn8));
    });

    return {
      items: filtered.slice(offset, offset + limit).map((post) => toPlatoonView({ post, stats, nicknames })),
      total: filtered.length,
      limit,
      offset
    };
  }

  async create({ userId, accountId, expiresInHours, availableFrom, availableUntil, minWn8, message, ...rest }: CreatePlatoonRequest) {
    const account = await this.accounts.accountOf({ userId, accountId });
    const now = new Date();

    if (availableFrom && availableUntil && new Date(availableFrom) > new Date(availableUntil)) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'availableFrom must be before availableUntil');
    }

    await this.prisma.platoonPost.updateMany({ where: { userId, status: 'open' }, data: { status: 'closed' } });

    const post = await this.prisma.platoonPost.create({
      data: {
        ...rest,
        userId,
        accountId: account,
        minWn8: minWn8 ?? null,
        message: message ?? null,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableUntil: availableUntil ? new Date(availableUntil) : null,
        expiresAt: new Date(now.getTime() + expiresInHours * 3_600_000)
      }
    });

    const [stats, nicknames] = await Promise.all([this.accounts.statsOf([account]), this.accounts.nicknamesOf([account])]);

    return toPlatoonView({ post, stats, nicknames });
  }

  async close({ id, userId }: CloseOwnInput): Promise<void> {
    const { count } = await this.prisma.platoonPost.updateMany({ where: { id, userId, status: 'open' }, data: { status: 'closed' } });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No open platoon post ${id} of yours`);
    }
  }

  async expire(now: Date): Promise<number> {
    const { count } = await this.prisma.platoonPost.updateMany({ where: { status: 'open', expiresAt: { lte: now } }, data: { status: 'expired' } });

    return count;
  }
}
