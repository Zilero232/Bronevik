import { Injectable } from '@nestjs/common';
import { unique } from 'remeda';

import type { CreateFollowInput, FollowCircle, FollowView, RemoveFollowInput } from '../social.types';

import { AppConflictException, AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { FEED } from '../config';
import { FOLLOW_KIND_FROM_DB } from '../lib/views';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<FollowView[]> {
    const follows = await this.prisma.follow.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const players = await this.prisma.player.findMany({
      where: { accountId: { in: follows.filter((follow) => follow.kind === 'player').map((follow) => follow.targetId) } },
      select: { accountId: true, nickname: true }
    });

    return follows.map((follow) => ({
      id: follow.id,
      kind: FOLLOW_KIND_FROM_DB[follow.kind],
      targetId: Number(follow.targetId),
      label: follow.kind === 'player' ? (players.find((player) => player.accountId === follow.targetId)?.nickname ?? null) : null,
      createdAt: follow.createdAt.toISOString()
    }));
  }

  async create({ userId, kind, targetId }: CreateFollowInput): Promise<FollowView[]> {
    const count = await this.prisma.follow.count({ where: { userId } });

    if (count >= FEED.maxFollows) {
      throw new AppConflictException('CONFLICT', 'Too many follows');
    }

    await this.prisma.follow.upsert({
      where: { userId_kind_targetId: { userId, kind, targetId: BigInt(targetId) } },
      create: { userId, kind, targetId: BigInt(targetId) },
      update: {}
    });

    return this.list(userId);
  }

  async remove({ userId, id }: RemoveFollowInput): Promise<void> {
    const { count } = await this.prisma.follow.deleteMany({ where: { id, userId } });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No follow ${id}`);
    }
  }

  async circle(userId: string): Promise<FollowCircle> {
    const [follows, links] = await Promise.all([
      this.prisma.follow.findMany({ where: { userId, kind: 'player' }, select: { targetId: true } }),
      this.prisma.userLestaAccount.findMany({ where: { userId }, select: { accountId: true } })
    ]);

    const own = new Set(links.map((link) => link.accountId));

    return { accountIds: unique([...own, ...follows.map((follow) => follow.targetId)]), own };
  }
}
