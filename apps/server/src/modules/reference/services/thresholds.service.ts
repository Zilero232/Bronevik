import { Injectable } from '@nestjs/common';

import type { MasteryThreshold, MoeThreshold, ThresholdSource } from '../../../../generated';
import type { CachedThresholds, MoeHistoryInput, ThresholdsAsOfInput, ThresholdSet } from '../reference.types';

import { PrismaService } from '../../../core';
import { CATALOG } from '../config';
import { preferredBySource } from '../lib';

@Injectable()
export class ThresholdsService {
  private cache = new Map<string, CachedThresholds>();

  constructor(private readonly prisma: PrismaService) {}

  async moe(tankId: number): Promise<MoeThreshold | null> {
    const { moe } = await this.latest();

    return moe.get(tankId) ?? null;
  }

  async mastery(tankId: number): Promise<MasteryThreshold | null> {
    const { mastery } = await this.latest();

    return mastery.get(tankId) ?? null;
  }

  async latest(source?: ThresholdSource): Promise<CachedThresholds> {
    const key = source ?? 'any';
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.at < CATALOG.ttlMs) {
      return cached;
    }

    const loaded = await this.asOf({ date: null, source });
    const entry = { at: Date.now(), ...loaded };

    this.cache.set(key, entry);

    return entry;
  }

  async asOf({ date, source }: ThresholdsAsOfInput): Promise<ThresholdSet> {
    const upTo = date ?? new Date('9999-12-31');

    const [moe, mastery] = await Promise.all([
      this.prisma.$queryRaw<MoeThreshold[]>`
        SELECT DISTINCT ON (tank_id, source)
               tank_id AS "tankId", date, source, p65, p85, p95, p100, sample_size AS "sampleSize", captured_at AS "capturedAt"
        FROM moe_threshold
        WHERE date <= ${upTo}::date AND (${source ?? null}::text IS NULL OR source::text = ${source ?? null}::text)
        ORDER BY tank_id, source, date DESC
      `,
      this.prisma.$queryRaw<MasteryThreshold[]>`
        SELECT DISTINCT ON (tank_id, source)
               tank_id AS "tankId", date, source, class_3 AS "class3", class_2 AS "class2", class_1 AS "class1", master,
               sample_size AS "sampleSize", captured_at AS "capturedAt"
        FROM mastery_threshold
        WHERE date <= ${upTo}::date AND (${source ?? null}::text IS NULL OR source::text = ${source ?? null}::text)
        ORDER BY tank_id, source, date DESC
      `
    ]);

    return { moe: preferredBySource(moe), mastery: preferredBySource(mastery) };
  }

  async moeHistory({ tankId, from, to, source }: MoeHistoryInput): Promise<MoeThreshold[]> {
    return this.prisma.moeThreshold.findMany({
      where: { tankId, ...(source ? { source } : {}), date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } },
      orderBy: [{ date: 'asc' }, { source: 'asc' }]
    });
  }
}
