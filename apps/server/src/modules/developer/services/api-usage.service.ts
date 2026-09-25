import type { ApiErrorLogEntry, ApiUsage } from '@bronevik/schemas';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { Injectable, Logger } from '@nestjs/common';
import { subDays } from 'date-fns';

import type {
  AddUsageInput,
  LogErrorInput,
  OwnedKeyInput,
  RecordThrottledInput,
  RecordUsageInput,
  UsageBufferEntry,
  UsageInput
} from '../developer.types';

import { PrismaService } from '../../../core';
import { API_PLANS, API_USAGE } from '../config';
import { addCounters, emptyCounters, topEndpoints, usageDay, usagePointOf, usagePoints } from '../lib';
import { ApiKeysService } from './api-keys.service';
import { DeveloperPlanService } from './developer-plan.service';

@Injectable()
export class ApiUsageService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ApiUsageService.name);
  private buffer = new Map<string, UsageBufferEntry>();
  private lastUsed = new Map<string, Date>();
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly keys: ApiKeysService,
    private readonly plans: DeveloperPlanService
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => void this.flush(), API_USAGE.flushIntervalMs);
    this.timer.unref();
  }

  async onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    await this.flush();
  }

  record({ keyId, endpoint, latencyMs, failed }: RecordUsageInput): void {
    this.add({ keyId, endpoint, counters: { requests: 1, errors: failed ? 1 : 0, throttled: 0, latencyMs: Math.max(0, Math.round(latencyMs)) } });
    this.lastUsed.set(keyId, new Date());
  }

  recordThrottled({ keyId, endpoint }: RecordThrottledInput): void {
    this.add({ keyId, endpoint, counters: { ...emptyCounters(), throttled: 1 } });
  }

  logError({ keyId, method, path, status, code, message }: LogErrorInput): void {
    void this.prisma.apiErrorLog
      .create({ data: { apiKeyId: keyId, method, path, status, code, message: message?.slice(0, API_USAGE.errorMessageMaxLength) ?? null } })
      .catch((error: unknown) => {
        this.logger.warn(`API error for key ${keyId} not logged: ${error instanceof Error ? error.message : String(error)}`);
      });
  }

  async usage({ userId, id, days }: UsageInput): Promise<ApiUsage> {
    const key = await this.keys.owned({ userId, id });
    const plan = key.plan === 'partner' ? 'partner' : await this.plans.planFor(userId);
    const from = new Date(usageDay(subDays(new Date(), days - 1)));

    const rows = await this.prisma.apiUsageDaily.findMany({ where: { apiKeyId: id, day: { gte: from } }, orderBy: { day: 'asc' } });

    const usageRows = rows.map((row) => ({
      day: usageDay(row.day),
      endpoint: row.endpoint,
      requests: row.requests,
      errors: row.errors,
      throttled: row.throttled,
      latencyMsTotal: Number(row.latencyMsTotal)
    }));

    return {
      apiKeyId: id,
      plan,
      limits: API_PLANS[plan],
      today: usagePointOf({ rows: usageRows, day: usageDay(new Date()) }),
      history: usagePoints(usageRows),
      topEndpoints: topEndpoints(usageRows)
    };
  }

  async errors({ userId, id }: OwnedKeyInput): Promise<ApiErrorLogEntry[]> {
    await this.keys.owned({ userId, id });

    const rows = await this.prisma.apiErrorLog.findMany({
      where: { apiKeyId: id },
      orderBy: { occurredAt: 'desc' },
      take: API_USAGE.errorLogLimit
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

  async flush(): Promise<void> {
    const pending = [...this.buffer.values()];
    const used = [...this.lastUsed.entries()];

    this.buffer = new Map();
    this.lastUsed = new Map();

    try {
      for (const entry of pending) {
        const { requests, errors, throttled, latencyMs } = entry.counters;
        const day = new Date(entry.day);

        await this.prisma.apiUsageDaily.upsert({
          where: { apiKeyId_day_endpoint: { apiKeyId: entry.keyId, day, endpoint: entry.endpoint } },
          create: { apiKeyId: entry.keyId, day, endpoint: entry.endpoint, requests, errors, throttled, latencyMsTotal: BigInt(latencyMs) },
          update: {
            requests: { increment: requests },
            errors: { increment: errors },
            throttled: { increment: throttled },
            latencyMsTotal: { increment: BigInt(latencyMs) }
          }
        });
      }

      for (const [id, lastUsedAt] of used) {
        await this.prisma.apiKey.updateMany({ where: { id }, data: { lastUsedAt } });
      }
    } catch (error) {
      this.logger.warn(`API usage not flushed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private add({ keyId, endpoint, counters }: AddUsageInput): void {
    const day = usageDay(new Date());
    const bufferKey = `${keyId}|${day}|${endpoint}`;
    const current = this.buffer.get(bufferKey);

    this.buffer.set(bufferKey, { keyId, day, endpoint, counters: current ? addCounters({ left: current.counters, right: counters }) : counters });
  }
}
