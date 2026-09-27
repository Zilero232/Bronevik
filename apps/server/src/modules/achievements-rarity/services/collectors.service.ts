import { Injectable } from '@nestjs/common';
import { unique } from 'remeda';

import type { CollectorsQuery, CollectorsView, HeldAchievement, PlayerCollection, PlayerCollectionInput } from '../achievements-rarity.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { ACHIEVEMENTS_AGGREGATE, ACHIEVEMENTS_VIEW } from '../config';
import { byRarity, heldNames, readCounts, seriesProgress, standing } from '../lib';
import { toCollectorRow, toSeriesView } from '../mappers';
import { COLLECTOR_ROW_SELECT, RANKED_COLLECTORS } from '../selects';
import { AchievementCatalogService } from './achievement-catalog.service';

@Injectable()
export class CollectorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: AchievementCatalogService,
    private readonly entitlements: EntitlementsService
  ) {}

  async leaderboard({ limit, offset }: CollectorsQuery): Promise<CollectorsView> {
    const [rows, total] = await Promise.all([
      this.prisma.accountAchievements.findMany({
        where: RANKED_COLLECTORS,
        orderBy: [{ points: 'desc' }, { held: 'desc' }, { accountId: 'asc' }],
        skip: offset,
        take: limit,
        select: COLLECTOR_ROW_SELECT
      }),
      this.prisma.accountAchievements.count({ where: RANKED_COLLECTORS })
    ]);

    const clanIds = unique(rows.flatMap((row) => (row.player.clanId === null ? [] : [row.player.clanId])));
    const clans =
      clanIds.length > 0 ? await this.prisma.clan.findMany({ where: { clanId: { in: clanIds } }, select: { clanId: true, tag: true } }) : [];

    const tags = new Map(clans.map((clan) => [clan.clanId, clan.tag]));

    return {
      items: rows.map((row, index) =>
        toCollectorRow({ row, rank: offset + index + 1, clanTag: row.player.clanId === null ? null : (tags.get(row.player.clanId) ?? null) })
      ),
      total,
      limit,
      offset
    };
  }

  async player({ accountId, viewerUserId }: PlayerCollectionInput): Promise<PlayerCollection> {
    const player = await this.prisma.player.findUnique({
      where: { accountId },
      select: {
        nickname: true,
        isHidden: true,
        achievementSet: { select: { counts: true, maxSeries: true, held: true, points: true, completion: true, fetchedAt: true, computedAt: true } },
        lestaLinks: { select: { userId: true } }
      }
    });

    if (!player) {
      throw new AppNotFoundException('PLAYER_NOT_FOUND', `No player with id ${accountId}`);
    }

    if (player.isHidden) {
      throw new AppNotFoundException('LESTA_ACCOUNT_HIDDEN', 'This player asked for their data to be hidden');
    }

    const set = player.achievementSet;
    const ownerId = player.lestaLinks[0]?.userId ?? null;

    const [entries, ranked, above, isPlus] = await Promise.all([
      this.catalog.entries(),
      this.prisma.accountAchievements.count({ where: RANKED_COLLECTORS }),
      set?.computedAt ? this.prisma.accountAchievements.count({ where: { ...RANKED_COLLECTORS, points: { gt: set.points } } }) : Promise.resolve(0),
      ownerId ? this.entitlements.isPlus(ownerId) : Promise.resolve(false)
    ]);

    const items = new Map(entries.map((entry) => [entry.item.name, entry.item]));
    const counts = readCounts(set?.counts ?? {});
    const held: HeldAchievement[] = byRarity(
      heldNames(counts).flatMap((name) => {
        const item = items.get(name);

        return item ? [{ ...item, count: counts[name] ?? 0 }] : [];
      })
    );

    const sections = new Set<string>(ACHIEVEMENTS_AGGREGATE.completionSections);
    const position = set?.computedAt ? standing({ above, total: ranked }) : { rank: null, topPercent: null };

    return {
      accountId: Number(accountId),
      nickname: player.nickname,
      fetchedAt: set?.fetchedAt.toISOString() ?? null,
      held: set?.held ?? 0,
      points: set?.points ?? 0,
      completion: set?.completion ?? 0,
      obtainable: entries.filter((entry) => entry.item.section !== null && sections.has(entry.item.section)).length,
      rank: position.rank,
      topPercent: position.topPercent,
      sample: ranked,
      rarest: held.slice(0, ACHIEVEMENTS_VIEW.rarestHeld),
      series: seriesProgress(readCounts(set?.maxSeries ?? {})).map((row) => toSeriesView({ row, items })),
      showcase: isPlus ? held.slice(0, ACHIEVEMENTS_VIEW.showcaseSize) : null,
      viewerIsOwner: viewerUserId !== null && ownerId === viewerUserId
    };
  }
}
