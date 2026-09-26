import type { ApiErrorLogEntry, ApiUsage } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { OwnedKeyInput, UsageInput } from '../developer.types';

import { isoDay } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { API_TIERS, API_USAGE_REPORT } from '../config';
import { topEndpoints, usagePointOf, usagePoints } from '../lib';
import { ApiKeysService } from './api-keys.service';
import { ApiTierService } from './api-tier.service';

@Injectable()
export class ApiUsageReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly keys: ApiKeysService,
    private readonly tiers: ApiTierService
  ) {}

  async usage({ userId, id, days }: UsageInput): Promise<ApiUsage> {
    await this.keys.owned({ userId, id });

    const tier = await this.tiers.tierFor(userId);
    const from = new Date(isoDay(subDays(new Date(), days - 1)));
    const rows = await this.prisma.apiUsageDaily.findMany({ where: { apiKeyId: id, day: { gte: from } }, orderBy: { day: 'asc' } });

    const usageRows = rows.map((row) => ({
      day: isoDay(row.day),
      endpoint: row.endpoint,
      requests: row.requests,
      errors: row.errors,
      throttled: row.throttled,
      latencyMsTotal: Number(row.latencyMsTotal)
    }));

    return {
      apiKeyId: id,
      tier,
      limits: API_TIERS[tier],
      today: usagePointOf({ rows: usageRows, day: isoDay(new Date()) }),
      history: usagePoints(usageRows),
      topEndpoints: topEndpoints(usageRows)
    };
  }

  async errors({ userId, id }: OwnedKeyInput): Promise<ApiErrorLogEntry[]> {
    await this.keys.owned({ userId, id });

    const rows = await this.prisma.apiErrorLog.findMany({
      where: { apiKeyId: id },
      orderBy: { occurredAt: 'desc' },
      take: API_USAGE_REPORT.errorLogLimit
    });

    return rows.map((row) => ({
      id: row.id,
      method: row.method,
      path: row.path,
      status: row.status,
      code: row.code,
      message: row.message,
      occurredAt: row.occurredAt.toISOString()
    }));
  }
}
