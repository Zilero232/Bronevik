import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { isNonNull } from 'remeda';

import type { TankThreshold, ThresholdSource } from '../../../../generated';
import type {
  LatestThresholdsInput,
  MasteryThresholdRecord,
  MoeHistoryInput,
  MoeThresholdRecord,
  ThresholdsAsOfInput,
  ThresholdSet
} from '../reference.types';

import { PrismaService } from '../../../core';
import { CATALOG } from '../config';
import { preferredBySource } from '../lib';
import { toMasteryThresholdRecord, toMoeThresholdRecord } from '../mappers';

@Injectable()
export class ThresholdsService {
  private readonly cache = new LRUCache<string, ThresholdSet, ThresholdSource | undefined>({
    max: CATALOG.thresholdKeys,
    ttl: CATALOG.ttlMs,
    fetchMethod: (_key, _stale, { context }) => this.asOf({ date: null, source: context })
  });

  constructor(private readonly prisma: PrismaService) {}

  async moe(tankId: number): Promise<MoeThresholdRecord | null> {
    const { moe } = await this.latest();

    return moe.get(tankId) ?? null;
  }

  async mastery(tankId: number): Promise<MasteryThresholdRecord | null> {
    const { mastery } = await this.latest();

    return mastery.get(tankId) ?? null;
  }

  async latest(source?: ThresholdSource): Promise<ThresholdSet> {
    const loaded = await this.cache.fetch(source ?? CATALOG.key, { context: source });

    return loaded ?? { moe: new Map(), mastery: new Map() };
  }

  async asOf({ date, source }: ThresholdsAsOfInput): Promise<ThresholdSet> {
    const upTo = date ?? new Date('9999-12-31');

    const [moe, mastery] = await Promise.all([this.latestRows({ kind: 'moe', upTo, source }), this.latestRows({ kind: 'mastery', upTo, source })]);

    return {
      moe: preferredBySource(moe.map(toMoeThresholdRecord)),
      mastery: preferredBySource(mastery.map(toMasteryThresholdRecord).filter(isNonNull))
    };
  }

  async moeHistory({ tankId, from, to, source }: MoeHistoryInput): Promise<MoeThresholdRecord[]> {
    const rows = await this.prisma.tankThreshold.findMany({
      where: {
        kind: 'moe',
        tankId,
        ...(source ? { source } : {}),
        date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) }
      },
      orderBy: [{ date: 'asc' }, { source: 'asc' }]
    });

    return rows.map(toMoeThresholdRecord);
  }

  private latestRows({ kind, upTo, source }: LatestThresholdsInput): Promise<TankThreshold[]> {
    return this.prisma.$queryRaw<TankThreshold[]>`
      SELECT DISTINCT ON (tank_id, source)
             kind, tank_id AS "tankId", date, source,
             level_1 AS "level1", level_2 AS "level2", level_3 AS "level3", level_4 AS "level4",
             sample_size AS "sampleSize", captured_at AS "capturedAt"
      FROM tank_threshold
      WHERE kind = ${kind}::threshold_kind
        AND date <= ${upTo}::date
        AND (${source ?? null}::text IS NULL OR source::text = ${source ?? null}::text)
      ORDER BY tank_id, source, date DESC
    `;
  }
}
