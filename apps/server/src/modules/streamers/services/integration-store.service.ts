import { Injectable } from '@nestjs/common';

import type { StreamerIntegration, StreamerProvider } from '../../../../generated';
import type { OAuthStateInput, SaveIntegrationInput, StoreTokenInput, StreamerIntegrationView } from '../streamers.types';

import { readRecord } from '../../../common/lib';
import { PrismaService } from '../../../core';

@Injectable()
export class IntegrationStoreService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<StreamerIntegrationView[]> {
    const integrations = await this.prisma.streamerIntegration.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });

    return integrations.map((integration) => {
      const login = readRecord(integration.config).login;

      return {
        provider: integration.provider,
        externalId: integration.externalId,
        login: typeof login === 'string' ? login : null,
        connectedAt: integration.createdAt.toISOString()
      };
    });
  }

  byProvider(provider: StreamerProvider): Promise<StreamerIntegration[]> {
    return this.prisma.streamerIntegration.findMany({ where: { provider, accessToken: { not: null } } });
  }

  async save({ userId, provider, externalId, accessToken, refreshToken, expiresAt, scope, config }: SaveIntegrationInput): Promise<void> {
    const data = { externalId, accessToken, refreshToken, tokenExpiresAt: expiresAt, scope, config: config ?? undefined };

    await this.prisma.$transaction([
      this.prisma.streamerIntegration.deleteMany({ where: { provider, externalId, NOT: { userId } } }),
      this.prisma.streamerIntegration.upsert({
        where: { userId_provider: { userId, provider } },
        create: { userId, provider, ...data },
        update: data
      })
    ]);
  }

  async storeToken({ provider, externalId, accessToken, refreshToken, expiresAt }: StoreTokenInput): Promise<void> {
    await this.prisma.streamerIntegration.updateMany({
      where: { provider, externalId },
      data: { accessToken, refreshToken, tokenExpiresAt: expiresAt }
    });
  }

  async remove({ userId, provider }: OAuthStateInput): Promise<void> {
    await this.prisma.streamerIntegration.deleteMany({ where: { userId, provider } });
  }
}
