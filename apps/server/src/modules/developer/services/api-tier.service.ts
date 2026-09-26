import type { ApiTier, ApiTiers } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { apiTierSchema } from '@otmetki/schemas';
import { LRUCache } from 'lru-cache';

import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { API_KEY_POLICY, API_TIERS } from '../config';
import { keyTierOf } from '../lib';

@Injectable()
export class ApiTierService {
  private readonly cache = new LRUCache<string, ApiTier>({ max: API_KEY_POLICY.tierCacheMaxEntries, ttl: API_KEY_POLICY.tierCacheTtlMs });

  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService
  ) {}

  tiers(): ApiTiers {
    return apiTierSchema.options.map((tier) => ({ tier, limits: API_TIERS[tier] }));
  }

  async tierFor(userId: string): Promise<ApiTier> {
    const [keys, isPlus] = await Promise.all([
      this.prisma.apiKey.findMany({ where: { referenceId: userId, enabled: true }, select: { metadata: true } }),
      this.entitlements.isPlus(userId)
    ]);

    const tier = keys.some(({ metadata }) => keyTierOf(metadata) === 'community') ? 'community' : isPlus ? 'plus' : 'free';

    this.cache.set(userId, tier);

    return tier;
  }

  async cachedTierFor(userId: string): Promise<ApiTier> {
    return this.cache.get(userId) ?? this.tierFor(userId);
  }
}
