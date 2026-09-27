import { Injectable } from '@nestjs/common';

import type { PromoCode } from '../../../../generated';
import type { ClaimRedemptionInput, PromoCodeInput, RecordRedemptionInput } from '../billing.types';

import { AppBadRequestException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { PROMO_REJECTION_CODE } from '../config';
import { promoRejection } from '../lib';
import { EntitlementsService } from './entitlements.service';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class PromoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptions: SubscriptionService,
    private readonly entitlements: EntitlementsService
  ) {}

  normalise(code: string): string {
    return code.trim().toUpperCase();
  }

  async usable({ userId, code }: PromoCodeInput): Promise<PromoCode> {
    const normalised = this.normalise(code);
    const [promo, redeemed] = await Promise.all([
      this.prisma.promoCode.findUnique({ where: { code: normalised } }),
      this.prisma.promoRedemption.findUnique({ where: { code_userId: { code: normalised, userId } } })
    ]);

    const rejection = promoRejection({ promo, now: new Date(), alreadyRedeemed: redeemed !== null });

    if (rejection || !promo) {
      const reason = rejection ?? 'unknown';

      throw new AppBadRequestException(PROMO_REJECTION_CODE[reason], `Promo code rejected: ${reason}`);
    }

    return promo;
  }

  async redeemFreeDays({ userId, code }: PromoCodeInput): Promise<void> {
    const promo = await this.usable({ userId, code });

    if (!promo.freeDays || promo.discountPercent) {
      throw new AppBadRequestException('PROMO_CHECKOUT_ONLY', 'This promo code is a checkout discount, pass it with the plan');
    }

    const days = promo.freeDays;
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      await this.claimRedemption({ db: tx, userId, code: promo.code, now });
      await this.subscriptions.grantDays({ db: tx, userId, days, now });
    });

    await this.entitlements.syncTracking(userId);
  }

  async claimRedemption({ db, userId, code, now }: ClaimRedemptionInput): Promise<void> {
    const claimed = await db.promoCode.updateMany({
      where: {
        code,
        AND: [
          { OR: [{ maxUses: null }, { usedCount: { lt: db.promoCode.fields.maxUses } }] },
          { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }
        ]
      },
      data: { usedCount: { increment: 1 } }
    });

    if (claimed.count === 0) {
      throw new AppBadRequestException(PROMO_REJECTION_CODE.exhausted, 'Promo code rejected: exhausted');
    }

    const inserted = await db.promoRedemption.createMany({ data: [{ code, userId }], skipDuplicates: true });

    if (inserted.count === 0) {
      throw new AppBadRequestException(PROMO_REJECTION_CODE.alreadyRedeemed, 'Promo code rejected: alreadyRedeemed');
    }
  }

  async recordRedemption({ db, userId, code }: RecordRedemptionInput): Promise<void> {
    const inserted = await db.promoRedemption.createMany({ data: [{ code, userId }], skipDuplicates: true });

    if (inserted.count > 0) {
      await db.promoCode.updateMany({
        where: { code, OR: [{ maxUses: null }, { usedCount: { lt: db.promoCode.fields.maxUses } }] },
        data: { usedCount: { increment: 1 } }
      });
    }
  }
}
