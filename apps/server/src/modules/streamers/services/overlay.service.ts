import type { Overlay as OverlayView } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { overlayConfigSchema } from '@otmetki/schemas';

import type { Overlay } from '../../../../generated';
import type {
  AssertAccountInput,
  CreateOverlayInput,
  OverlayData,
  OverlayViewInput,
  OwnedInput,
  PreviewOverlayRequest,
  UpdateOverlayInput
} from '../streamers.types';

import { AppBadRequestException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { toNumber } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { LIMIT_LOCK_SCOPE, lockedTransaction, PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { CosmeticsService } from '../../progression';
import { OVERLAY, OVERLAY_KIND_FROM_DB, OVERLAY_KIND_TO_DB } from '../config';
import { pausedOverlayIds } from '../lib';
import { OverlayDataService } from './overlay-data.service';

@Injectable()
export class OverlayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly entitlements: EntitlementsService,
    private readonly data: OverlayDataService,
    private readonly cosmetics: CosmeticsService
  ) {}

  async list(userId: string): Promise<OverlayView[]> {
    const [overlays, paused] = await Promise.all([
      this.prisma.overlay.findMany({ where: { userId }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
      this.pausedIds(userId)
    ]);

    return overlays.map((overlay) => this.toView({ overlay, isPaused: paused.has(overlay.id) }));
  }

  async pausedIds(userId: string): Promise<Set<string>> {
    const [isPlus, overlays] = await Promise.all([
      this.entitlements.isPlus(userId),
      this.prisma.overlay.findMany({ where: { userId }, select: { id: true, createdAt: true } })
    ]);

    return pausedOverlayIds({ overlays, isPlus });
  }

  async create({ userId, name, kind, accountId, config }: CreateOverlayInput): Promise<OverlayView> {
    await this.assertAccount({ userId, accountId });
    await this.cosmetics.assertOverlayTheme({ userId, theme: config.theme });

    const overlay = await lockedTransaction({
      prisma: this.prisma,
      scope: LIMIT_LOCK_SCOPE.overlays,
      key: userId,
      run: async (tx) => {
        const count = await tx.overlay.count({ where: { userId } });

        await this.entitlements.assertWithinLimit({ userId, key: 'overlays', count, feature: 'overlays' });

        return tx.overlay.create({
          data: {
            userId,
            name,
            kind: OVERLAY_KIND_TO_DB[kind],
            accountId: accountId === undefined ? null : BigInt(accountId),
            theme: config.theme,
            config
          }
        });
      }
    });

    return this.toView({ overlay, isPaused: false });
  }

  async update({ userId, id, name, kind, accountId, config }: UpdateOverlayInput): Promise<OverlayView> {
    await this.owned({ userId, id });
    await this.assertAccount({ userId, accountId });

    if (config !== undefined) {
      await this.cosmetics.assertOverlayTheme({ userId, theme: config.theme });
    }

    const overlay = await this.prisma.overlay.update({
      where: { id },
      data: {
        ...(name === undefined ? {} : { name }),
        ...(kind === undefined ? {} : { kind: OVERLAY_KIND_TO_DB[kind] }),
        ...(accountId === undefined ? {} : { accountId: BigInt(accountId) }),
        ...(config === undefined ? {} : { config, theme: config.theme })
      }
    });

    return this.toView({ overlay, isPaused: (await this.pausedIds(userId)).has(overlay.id) });
  }

  async preview(input: PreviewOverlayRequest): Promise<OverlayData> {
    await this.assertAccount({ userId: input.userId, accountId: input.accountId });

    return this.data.preview(input);
  }

  async remove({ userId, id }: OwnedInput): Promise<void> {
    await this.owned({ userId, id });
    await this.prisma.overlay.delete({ where: { id } });
  }

  toView({ overlay, isPaused }: OverlayViewInput): OverlayView {
    const parsed = overlayConfigSchema.safeParse(overlay.config);

    if (!parsed.success) {
      throw new AppBadRequestException('VALIDATION_FAILED', `Overlay ${overlay.id} has an invalid config`);
    }

    return {
      id: overlay.id,
      name: overlay.name,
      kind: OVERLAY_KIND_FROM_DB[overlay.kind],
      accountId: overlay.accountId === null ? null : toNumber(overlay.accountId),
      config: parsed.data,
      publicUrl: new URL(OVERLAY.publicPath.replace('{publicKey}', overlay.publicKey), this.config.get('WEB_URL')).href,
      isPaused,
      updatedAt: overlay.updatedAt.toISOString()
    };
  }

  private async owned({ userId, id }: OwnedInput): Promise<Overlay> {
    const overlay = await this.prisma.overlay.findUnique({ where: { id } });

    if (!overlay || overlay.userId !== userId) {
      throw new AppNotFoundException('NOT_FOUND', `No overlay ${id}`);
    }

    return overlay;
  }

  private async assertAccount({ userId, accountId }: AssertAccountInput): Promise<void> {
    if (accountId === undefined) {
      return;
    }

    const owned = await this.prisma.userLestaAccount.count({ where: { userId, accountId: BigInt(accountId) } });

    if (owned === 0) {
      throw new AppForbiddenException('FORBIDDEN', 'The account is not linked to this user');
    }
  }
}
