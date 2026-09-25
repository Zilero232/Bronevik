import type { Overlay as OverlayView } from '@bronevik/schemas';

import { overlayConfigSchema } from '@bronevik/schemas';
import { Injectable } from '@nestjs/common';

import type { Overlay } from '../../../../generated';
import type { AssertAccountInput, CreateOverlayInput, OwnedInput, UpdateOverlayInput } from '../streamers.types';

import { AppBadRequestException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { toNumber } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { OVERLAY, OVERLAY_KIND_FROM_DB, OVERLAY_KIND_TO_DB } from '../config';

@Injectable()
export class OverlayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly entitlements: EntitlementsService
  ) {}

  async list(userId: string): Promise<OverlayView[]> {
    const overlays = await this.prisma.overlay.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });

    return overlays.map((overlay) => this.toView(overlay));
  }

  async create({ userId, name, kind, accountId, config }: CreateOverlayInput): Promise<OverlayView> {
    const [isPlus, count] = await Promise.all([this.entitlements.hasPlus(userId), this.prisma.overlay.count({ where: { userId } })]);

    if (count >= (isPlus ? OVERLAY.plusLimit : OVERLAY.freeLimit)) {
      throw new AppForbiddenException(isPlus ? 'PLAN_LIMIT_REACHED' : 'SUBSCRIPTION_REQUIRED', 'Overlay limit reached');
    }

    await this.assertAccount({ userId, accountId });

    const overlay = await this.prisma.overlay.create({
      data: {
        userId,
        name,
        kind: OVERLAY_KIND_TO_DB[kind],
        accountId: accountId === undefined ? null : BigInt(accountId),
        theme: config.theme,
        config,
        isPro: isPlus
      }
    });

    return this.toView(overlay);
  }

  async update({ userId, id, name, kind, accountId, config }: UpdateOverlayInput): Promise<OverlayView> {
    await this.owned({ userId, id });
    await this.assertAccount({ userId, accountId });

    const overlay = await this.prisma.overlay.update({
      where: { id },
      data: {
        ...(name === undefined ? {} : { name }),
        ...(kind === undefined ? {} : { kind: OVERLAY_KIND_TO_DB[kind] }),
        ...(accountId === undefined ? {} : { accountId: BigInt(accountId) }),
        ...(config === undefined ? {} : { config, theme: config.theme })
      }
    });

    return this.toView(overlay);
  }

  async remove({ userId, id }: OwnedInput): Promise<void> {
    await this.owned({ userId, id });
    await this.prisma.overlay.delete({ where: { id } });
  }

  toView(overlay: Overlay): OverlayView {
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
      isPro: overlay.isPro,
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
