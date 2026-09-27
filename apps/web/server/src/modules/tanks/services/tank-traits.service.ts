import type { TankTraits } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

import type { CatalogEntry } from '../../reference';
import type { FilterByTraitsInput, TraitsEntry } from '../tanks.types';

import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { TANK_TRAITS } from '../config';
import { matchesTraits, readSpecTraits, toTankTraits } from '../lib';
import { TankDifficultyService } from './tank-difficulty.service';

@Injectable()
export class TankTraitsService {
  private readonly cache = new LRUCache<string, Map<number, TraitsEntry>>({
    max: 1,
    ttl: TANK_TRAITS.cacheTtlMs,
    fetchMethod: () => this.load()
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly difficulty: TankDifficultyService
  ) {}

  async all(): Promise<Map<number, TraitsEntry>> {
    return (await this.cache.fetch(TANK_TRAITS.cacheKey)) ?? new Map();
  }

  async of(tankId: number): Promise<TraitsEntry | null> {
    const entries = await this.all();

    return entries.get(tankId) ?? null;
  }

  async traits(tankId: number): Promise<TankTraits> {
    const entry = await this.of(tankId);

    return entry?.traits ?? { status: 'researchable', role: null };
  }

  async filter({ entries, filter }: FilterByTraitsInput): Promise<CatalogEntry[]> {
    const byDifficulty = filter.difficulties?.length ? await this.difficulty.matching(filter.difficulties) : null;
    const withDifficulty = byDifficulty ? entries.filter((entry) => byDifficulty.has(entry.summary.tankId)) : [...entries];

    if (!filter.statuses?.length && !filter.roles?.length) {
      return withDifficulty;
    }

    const traits = await this.all();

    return withDifficulty.filter((entry) => {
      const found = traits.get(entry.summary.tankId);

      return found !== undefined && matchesTraits({ traits: found.traits, filter });
    });
  }

  private async load(): Promise<Map<number, TraitsEntry>> {
    const [entries, offered] = await Promise.all([
      this.catalog.all(),
      this.prisma.$queryRaw<{ tank_id: number }[]>`SELECT DISTINCT unnest(tank_ids) AS tank_id FROM premium_offer`
    ]);

    const withOffers = new Set(offered.map((row) => row.tank_id));

    return new Map(
      [...entries.values()].map((entry) => {
        const spec = readSpecTraits(entry.specs);
        const hasOffers = withOffers.has(entry.summary.tankId);

        return [entry.summary.tankId, { spec, hasOffers, traits: toTankTraits({ summary: entry.summary, spec, hasOffers }) }];
      })
    );
  }
}
