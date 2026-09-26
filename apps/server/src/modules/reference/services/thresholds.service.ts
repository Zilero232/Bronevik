import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

import type { MasteryThreshold, MoeThreshold, ThresholdSource } from '../../../../generated';
import type { MoeHistoryInput, ThresholdsAsOfInput, ThresholdSet } from '../reference.types';

import { PrismaService } from '../../../core';
import { CATALOG } from '../config';
import { preferredBySource } from '../lib';

@Injectable()
export class ThresholdsService {
  private readonly cache = new LRUCache<string, ThresholdSet, ThresholdSource | undefined>({
    max: CATALOG.thresholdKeys,
    ttl: CATALOG.ttlMs,
    fetchMethod: (_key, _stale, { context }) => this.asOf({ date: null, source: context })
  });

  constructor(private readonly prisma: PrismaService) {}

  async moe(tankId: number): Promise<MoeThreshold | null> {
    const { moe } = await this.latest();

    return moe.get(tankId) ?? null;
  }

  async mastery(tankId: number): Promise<MasteryThreshold | null> {
    const { mastery } = await this.latest();

    return mastery.get(tankId) ?? null;
  }

  async latest(source?: ThresholdSource): Promise<ThresholdSet> {
    const loaded = await this.cache.fetch(source ?? CATALOG.key, { context: source });

    return loaded ?? { moe: new Map(), mastery: new Map() };
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
