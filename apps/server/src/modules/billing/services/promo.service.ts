import { Injectable } from '@nestjs/common';

import type { PromoCode } from '../../../../generated';
import type { PromoCodeInput, RecordRedemptionInput } from '../billing.types';

import { AppBadRequestException } from '../../../common/exceptions';
import { isUniqueViolation, PrismaService } from '../../../core';
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

    await this.prisma.$transaction(async (tx) => {
      await this.recordRedemption({ db: tx, userId, code: promo.code });
      await this.subscriptions.grantDays({ db: tx, userId, days, now: new Date() });
    });

    await this.entitlements.syncTracking(userId);
  }

  async recordRedemption({ db, userId, code }: RecordRedemptionInput): Promise<void> {
    try {
      await db.promoRedemption.create({ data: { code, userId } });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppBadRequestException(PROMO_REJECTION_CODE.alreadyRedeemed, 'Promo code rejected: alreadyRedeemed');
      }

      throw error;
    }

    await db.promoCode.update({ where: { code }, data: { usedCount: { increment: 1 } } });
  }
}
