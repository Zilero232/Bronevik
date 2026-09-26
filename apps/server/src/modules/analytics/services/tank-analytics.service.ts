import type { AnalyticsTank } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { TankAnalyticsInput } from '../analytics.types';

import { PrismaService } from '../../../core';
import { ExpectedValuesService, VehicleCatalogService } from '../../reference';
import { TANK_ANALYTICS } from '../config';
import { statLine, toAggregateRow, trendPoints } from '../lib';
import { AnalyticsOverviewService } from './analytics-overview.service';
import { OwnAccountService } from './own-account.service';

@Injectable()
export class TankAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly expected: ExpectedValuesService,
    private readonly accounts: OwnAccountService,
    private readonly overview: AnalyticsOverviewService
  ) {}

  async tank({ userId, account, tankId, granularity }: TankAnalyticsInput): Promise<AnalyticsTank> {
    const accountId = await this.accounts.resolve({ userId, account });

    const [rows, moe, expected, catalog] = await Promise.all([
      this.overview.trend({ accountId, from: null, granularity, tankId }),
      this.prisma.battle.findMany({
        where: { accountId, tankId, moePercent: { not: null } },
        orderBy: { startedAt: 'desc' },
        take: TANK_ANALYTICS.moePoints,
        select: { startedAt: true, moePercent: true }
      }),
      this.expected.all(),
      this.catalog.all()
    ]);

    const buckets = rows.map((row) => ({ ...toAggregateRow(row), bucket: row.bucket }));

    return {
      accountId: Number(accountId),
      vehicle: catalog.get(tankId)?.summary ?? null,
      granularity,
      totals: statLine({ rows: buckets, expected }),
      points: trendPoints({ rows: buckets, expected }),
      moe: moe
        .flatMap((battle) => (battle.moePercent === null ? [] : [{ at: battle.startedAt.toISOString(), percent: battle.moePercent }]))
        .toReversed()
    };
  }
}
