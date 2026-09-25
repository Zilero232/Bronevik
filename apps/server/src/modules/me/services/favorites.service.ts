import { Injectable } from '@nestjs/common';

import type { CreateFavoriteInput, Favorite, OwnedInput } from '../me.types';

import { AppConflictException, AppNotFoundException } from '../../../common/exceptions';
import { toNumber } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { CollectorProducerService } from '../../collector';
import { VehicleCatalogService } from '../../reference';
import { FAVORITES } from '../config';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly collector: CollectorProducerService
  ) {}

  async list(userId: string): Promise<Favorite[]> {
    const rows = await this.prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const ids = (kind: string) => rows.filter((row) => row.kind === kind).map((row) => row.targetId);

    const [players, clans, catalog] = await Promise.all([
      this.prisma.player.findMany({ where: { accountId: { in: ids('player') } }, select: { accountId: true, nickname: true } }),
      this.prisma.clan.findMany({ where: { clanId: { in: ids('clan') } }, select: { clanId: true, tag: true } }),
      this.catalog.all()
    ]);

    const nicknameOf = new Map(players.map((player) => [player.accountId, player.nickname]));
    const tagOf = new Map(clans.map((clan) => [clan.clanId, clan.tag]));

    return rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      targetId: toNumber(row.targetId),
      label: row.label,
      isOwn: row.isOwn,
      title:
        row.kind === 'player'
          ? (nicknameOf.get(row.targetId) ?? null)
          : row.kind === 'clan'
            ? (tagOf.get(row.targetId) ?? null)
            : (catalog.get(toNumber(row.targetId))?.summary.name ?? null),
      createdAt: row.createdAt.toISOString()
    }));
  }

  async create({ userId, kind, targetId, label, isOwn }: CreateFavoriteInput): Promise<Favorite> {
    const count = await this.prisma.favorite.count({ where: { userId } });

    if (count >= FAVORITES.maxCount) {
      throw new AppConflictException('CONFLICT', `At most ${FAVORITES.maxCount} favourites`);
    }

    await this.prisma.favorite.upsert({
      where: { userId_kind_targetId: { userId, kind, targetId: BigInt(targetId) } },
      create: { userId, kind, targetId: BigInt(targetId), label: label ?? null, isOwn: isOwn ?? false },
      update: { label: label ?? null, isOwn: isOwn ?? false }
    });

    if (kind === 'player') {
      await this.collector.enrol({ accountId: targetId, priority: 'high', reason: 'favorite' });
    }

    const favorites = await this.list(userId);
    const created = favorites.find((favorite) => favorite.kind === kind && favorite.targetId === targetId);

    if (!created) {
      throw new AppNotFoundException('NOT_FOUND', 'Favourite not found');
    }

    return created;
  }

  async remove({ userId, id }: OwnedInput): Promise<void> {
    const removed = await this.prisma.favorite.deleteMany({ where: { id, userId } });

    if (removed.count === 0) {
      throw new AppNotFoundException('NOT_FOUND', 'Favourite not found');
    }
  }
}
