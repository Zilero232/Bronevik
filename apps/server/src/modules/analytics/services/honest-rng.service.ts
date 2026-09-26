import type { AnalyticsRng } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { sumBy } from 'remeda';

import type { AnalyticsInput } from '../analytics.types';

import { percentOf } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { periodStart, readStoredShots, summarizeRolls } from '../lib';
import { OwnAccountService } from './own-account.service';

@Injectable()
export class HonestRngService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: OwnAccountService
  ) {}

  async rng({ userId, account, period }: AnalyticsInput): Promise<AnalyticsRng> {
    const accountId = await this.accounts.resolve({ userId, account });
    const from = periodStart({ period, now: new Date() });

    const battles = await this.prisma.battle.findMany({
      where: { accountId, ...(from ? { startedAt: { gte: from } } : {}) },
      select: { shots: true, shotsFired: true, shotsHit: true, shotsPierced: true }
    });

    const shotsFired = sumBy(battles, (battle) => battle.shotsFired ?? 0);
    const hits = sumBy(battles, (battle) => battle.shotsHit ?? 0);

    return {
      accountId: Number(accountId),
      period,
      battles: battles.length,
      ...summarizeRolls(battles.flatMap((battle) => readStoredShots(battle.shots))),
      accuracy: {
        shotsFired,
        hitRate: percentOf({ value: hits, by: shotsFired }),
        penRate: percentOf({ value: sumBy(battles, (battle) => battle.shotsPierced ?? 0), by: hits })
      }
    };
  }
}
