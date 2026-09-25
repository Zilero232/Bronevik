import type { ApiKey, CreatedApiKey, DeveloperOverview } from '@bronevik/schemas';

import { API_KEY } from '@bronevik/schemas';
import { Injectable } from '@nestjs/common';

import type { AuthenticatedApiKey, CachedApiKey, CreateKeyInput, OwnedKeyInput } from '../developer.types';

import { AppConflictException, AppNotFoundException, AppUnauthorizedException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { API_KEY_CACHE, API_PLANS } from '../config';
import { apiKeyPrefix, generateApiKey, matchesApiKeyHash, toApiKey } from '../lib';
import { DeveloperPlanService } from './developer-plan.service';

@Injectable()
export class ApiKeysService {
  private readonly cache = new Map<string, CachedApiKey>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly plans: DeveloperPlanService
  ) {}

  async overview(userId: string): Promise<DeveloperOverview> {
    const [plan, keys, webhooks] = await Promise.all([
      this.plans.planFor(userId),
      this.list(userId),
      this.prisma.webhookEndpoint.count({ where: { userId } })
    ]);

    return { plan, limits: API_PLANS[plan], keys, webhooks };
  }

  async list(userId: string): Promise<ApiKey[]> {
    const rows = await this.prisma.apiKey.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

    return rows.map(toApiKey);
  }

  async create({ userId, name, expiresAt }: CreateKeyInput): Promise<CreatedApiKey> {
    const active = await this.prisma.apiKey.count({ where: { userId, revokedAt: null } });

    if (active >= API_KEY.maxActivePerUser) {
      throw new AppConflictException('CONFLICT', `At most ${API_KEY.maxActivePerUser} active API keys`);
    }

    const plan = await this.plans.planFor(userId);
    const generated = generateApiKey();

    const row = await this.prisma.apiKey.create({
      data: {
        userId,
        name,
        prefix: generated.prefix,
        keyHash: generated.hash,
        plan,
        scopes: [],
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return { key: toApiKey(row), secret: generated.key };
  }

  async revoke({ userId, id }: OwnedKeyInput): Promise<void> {
    const row = await this.prisma.apiKey.findFirst({ where: { id, userId } });

    if (!row) {
      throw new AppNotFoundException('NOT_FOUND', 'API key not found');
    }

    if (!row.revokedAt) {
      await this.prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
    }

    this.cache.delete(row.prefix);
  }

  async owned({ userId, id }: OwnedKeyInput) {
    const row = await this.prisma.apiKey.findFirst({ where: { id, userId } });

    if (!row) {
      throw new AppNotFoundException('NOT_FOUND', 'API key not found');
    }

    return row;
  }

  async authenticate(raw: string): Promise<AuthenticatedApiKey> {
    const prefix = apiKeyPrefix(raw);

    if (!prefix) {
      throw new AppUnauthorizedException('API_KEY_INVALID', 'The API key is malformed');
    }

    const cached = this.cache.get(prefix);

    if (cached && Date.now() - cached.at < API_KEY_CACHE.ttlMs) {
      if (!matchesApiKeyHash({ key: raw, hash: cached.hash })) {
        throw new AppUnauthorizedException('API_KEY_INVALID', 'The API key is not valid');
      }

      return cached.key;
    }

    const row = await this.prisma.apiKey.findUnique({ where: { prefix } });

    if (!row || !matchesApiKeyHash({ key: raw, hash: row.keyHash })) {
      throw new AppUnauthorizedException('API_KEY_INVALID', 'The API key is not valid');
    }

    if (row.revokedAt || (row.expiresAt && row.expiresAt <= new Date())) {
      throw new AppUnauthorizedException('API_KEY_REVOKED', 'The API key was revoked or has expired');
    }

    const key: AuthenticatedApiKey = {
      id: row.id,
      userId: row.userId,
      plan: row.plan === 'partner' ? 'partner' : await this.plans.planFor(row.userId)
    };

    if (this.cache.size >= API_KEY_CACHE.maxEntries) {
      this.cache.clear();
    }

    this.cache.set(prefix, { key, hash: row.keyHash, at: Date.now() });

    return key;
  }
}
