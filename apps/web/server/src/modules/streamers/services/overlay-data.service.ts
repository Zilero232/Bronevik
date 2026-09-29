import type { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { challengeConditionSchema, overlayConfigSchema, plusLimit } from '@otmetki/schemas';

import type { Overlay } from '../../../../generated';
import type { AccountTankInput, BuildOverlayDataInput, OverlayData, PreviewOverlayRequest } from '../streamers.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { readRecord, toNumber } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { CosmeticsService } from '../../progression';
import { VehicleCatalogService } from '../../reference';
import { OVERLAY, OVERLAY_KIND_FROM_DB } from '../config';
import { winStreak } from '../lib';

@Injectable()
export class OverlayDataService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly entitlements: EntitlementsService,
    private readonly cosmetics: CosmeticsService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async find(publicKey: string): Promise<Overlay> {
    const overlay = await this.prisma.overlay.findUnique({ where: { publicKey } });

    if (!overlay) {
      throw new AppNotFoundException('NOT_FOUND', 'No such overlay');
    }

    return overlay;
  }

  async cached(publicKey: string): Promise<OverlayData> {
    const key = `overlay:${publicKey}`;
    const hit = await this.cache.get<OverlayData>(key);

    if (hit) {
      return hit;
    }

    const data = await this.compute(await this.find(publicKey));

    await this.cache.set(key, data, OVERLAY.cacheTtlMs);

    return data;
  }

  async accountOf(overlay: Overlay): Promise<bigint | null> {
    return overlay.accountId ?? this.profileAccount(overlay.userId);
  }

  async compute(overlay: Overlay): Promise<OverlayData> {
    const stored = overlayConfigSchema.parse(overlay.config);
    const config = { ...stored, theme: await this.cosmetics.effectiveOverlayTheme({ userId: overlay.userId, theme: stored.theme }) };
    const kind = OVERLAY_KIND_FROM_DB[overlay.kind];

    if (await this.isPaused(overlay)) {
      return {
        kind,
        name: overlay.name,
        config,
        isPaused: true,
        player: null,
        session: null,
        overall: null,
        moe: null,
        challenge: null,
        updatedAt: new Date().toISOString()
      };
    }

    return this.build({
      userId: overlay.userId,
      accountId: await this.accountOf(overlay),
      kind,
      name: overlay.name,
      config
    });
  }

  async isPaused(overlay: Overlay): Promise<boolean> {
    if (await this.entitlements.isPlus(overlay.userId)) {
      return false;
    }

    const older = await this.prisma.overlay.count({
      where: {
        userId: overlay.userId,
        OR: [{ createdAt: { lt: overlay.createdAt } }, { createdAt: overlay.createdAt, id: { lt: overlay.id } }]
      }
    });

    return older >= plusLimit({ key: 'overlays', isPlus: false });
  }

  async preview({ userId, accountId, kind, name, config }: PreviewOverlayRequest): Promise<OverlayData> {
    return this.build({
      userId,
      accountId: accountId === undefined ? await this.profileAccount(userId) : BigInt(accountId),
      kind,
      name: name ?? '',
      config
    });
  }

  private async profileAccount(userId: string): Promise<bigint | null> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { userId }, select: { accountId: true } });

    return profile?.accountId ?? null;
  }

  private async build({ userId, accountId, kind, name, config }: BuildOverlayDataInput): Promise<OverlayData> {
    const base = { kind, name, config, isPaused: false, updatedAt: new Date().toISOString() };

    if (accountId === null) {
      return { ...base, player: null, session: null, overall: null, moe: null, challenge: await this.challenge(userId) };
    }

    const [player, overall, session, challenge] = await Promise.all([
      this.prisma.player.findUnique({ where: { accountId }, select: { nickname: true } }),
      this.prisma.accountRating.findUnique({ where: { accountId_period: { accountId, period: 'overall' } } }),
      this.session(accountId),
      this.challenge(userId)
    ]);

    return {
      ...base,
      player: player ? { accountId: toNumber(accountId), nickname: player.nickname } : null,
      overall: overall ? { battles: overall.battles, winRate: overall.winRate, wn8: overall.wn8, broneIndex: overall.broneIndex } : null,
      session: session?.view ?? null,
      moe: session?.lastTankId ? await this.moe({ accountId, tankId: session.lastTankId }) : null,
      challenge
    };
  }

  private async session(accountId: bigint) {
    const session = await this.prisma.playSession.findFirst({ where: { accountId, battles: { gt: 0 } }, orderBy: { startedAt: 'desc' } });

    if (!session) {
      return null;
    }

    const battles = await this.prisma.battle.findMany({
      where: { sessionId: session.id },
      orderBy: { startedAt: 'desc' },
      select: { tankId: true, result: true, damageDealt: true }
    });

    const [last] = battles;
    const vehicle = last ? await this.catalog.summary(last.tankId) : null;

    return {
      lastTankId: last?.tankId ?? null,
      view: {
        battles: session.battles,
        wins: session.wins,
        winRate: session.battles > 0 ? (session.wins * 100) / session.battles : null,
        avgDamage: session.battles > 0 ? session.damageDealt / session.battles : null,
        frags: session.frags,
        wn8: session.wn8,
        broneIndex: session.broneIndex,
        winStreak: winStreak({ results: battles.map((battle) => battle.result) }),
        lastBattle:
          last && vehicle ? { tankId: last.tankId, tankName: vehicle.shortName || vehicle.name, result: last.result, damage: last.damageDealt } : null
      }
    };
  }

  private async moe({ accountId, tankId }: AccountTankInput) {
    const [progress, vehicle] = await Promise.all([
      this.prisma.playerTank.findUnique({
        where: { accountId_tankId: { accountId, tankId } },
        select: { marksOnGun: true, moePercent: true }
      }),
      this.catalog.summary(tankId)
    ]);

    return !progress || progress.moePercent === null
      ? null
      : { tankName: vehicle.shortName || vehicle.name, marks: progress.marksOnGun ?? 0, percent: progress.moePercent };
  }

  private async challenge(streamerUserId: string) {
    const challenge = await this.prisma.challenge.findFirst({
      where: { streamerUserId, status: { in: ['active', 'pending'] } },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }]
    });

    if (!challenge) {
      return null;
    }

    const condition = challengeConditionSchema.safeParse(challenge.condition);
    const progress = readRecord(challenge.progress);

    return {
      title: challenge.title,
      code: challenge.code,
      status: challenge.status,
      battles: typeof progress.battles === 'number' ? progress.battles : 0,
      battlesNeeded: condition.success ? condition.data.battles : 1,
      value: typeof progress.value === 'number' ? progress.value : 0,
      target: condition.success ? condition.data.value : 0
    };
  }
}
