import type { OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';

import { Injectable, Logger } from '@nestjs/common';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

import type { StreamerIntegration } from '../../../../generated';
import type { ChallengeAnnouncement, ChatAnnouncer, ChatMessageInput, TwitchConnection } from '../streamers.types';

import { readRecord } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { INTEGRATIONS, TWITCH } from '../config';
import { parseChatCommand } from '../lib';
import { IntegrationStoreService } from './integration-store.service';
import { StreamerStatsService } from './streamer-stats.service';

@Injectable()
export class TwitchChatService implements ChatAnnouncer, OnApplicationBootstrap, OnModuleDestroy {
  readonly provider = 'twitch';
  private readonly logger = new Logger(TwitchChatService.name);
  private readonly connections = new Map<string, TwitchConnection>();
  private auth: RefreshingAuthProvider | null = null;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly config: AppConfigService,
    private readonly store: IntegrationStoreService,
    private readonly stats: StreamerStatsService
  ) {}

  onApplicationBootstrap(): void {
    const clientId = this.config.get('TWITCH_CLIENT_ID');
    const clientSecret = this.config.get('TWITCH_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      this.logger.log('twitch chat is disabled: TWITCH_CLIENT_ID is empty');

      return;
    }

    if (this.config.get('NODE_ENV') === 'test') {
      return;
    }

    this.auth = new RefreshingAuthProvider({ clientId, clientSecret });

    this.auth.onRefresh((externalId, token) => {
      void this.store.storeToken({
        provider: 'twitch',
        externalId,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresIn === null ? null : new Date(token.obtainmentTimestamp + token.expiresIn * 1000)
      });
    });

    void this.sync();
    this.timer = setInterval(() => void this.sync(), INTEGRATIONS.syncIntervalMs);
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    for (const { client } of this.connections.values()) {
      client.quit();
    }

    this.connections.clear();
  }

  async announce({ streamerUserId, text }: ChallengeAnnouncement): Promise<void> {
    const connection = this.connections.get(streamerUserId);

    if (connection) {
      await connection.client.say(connection.login, text);
    }
  }

  async sync(): Promise<void> {
    try {
      const integrations = await this.store.byProvider('twitch');
      const active = new Set(integrations.map((integration) => integration.userId));

      for (const integration of integrations) {
        if (!this.connections.has(integration.userId)) {
          this.connect(integration);
        }
      }

      for (const [userId, { client, externalId }] of this.connections) {
        if (!active.has(userId)) {
          client.quit();
          this.auth?.removeUser(externalId);
          this.connections.delete(userId);
        }
      }
    } catch (error) {
      this.logger.warn(`twitch chat sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private connect(integration: StreamerIntegration): void {
    const login = readRecord(integration.config).login;

    if (!this.auth || typeof login !== 'string' || !integration.accessToken) {
      return;
    }

    const intent = `${TWITCH.intentPrefix}${integration.externalId}`;
    const expiresIn = integration.tokenExpiresAt ? Math.max(0, Math.floor((integration.tokenExpiresAt.getTime() - Date.now()) / 1000)) : null;

    this.auth.addUser(
      integration.externalId,
      { accessToken: integration.accessToken, refreshToken: integration.refreshToken, expiresIn, obtainmentTimestamp: Date.now() },
      [intent]
    );

    const client = new ChatClient({ authProvider: this.auth, channels: [login], authIntents: [intent] });

    client.onMessage((channel, _user, text) => {
      void this.reply({ userId: integration.userId, client, channel, text });
    });

    client.connect();
    this.connections.set(integration.userId, { client, login, externalId: integration.externalId });
  }

  private async reply({ userId, client, channel, text }: ChatMessageInput): Promise<void> {
    const command = parseChatCommand(text);

    if (!command) {
      return;
    }

    try {
      const answer = await this.stats.reply({ streamerUserId: userId, command });

      if (answer) {
        await client.say(channel, answer);
      }
    } catch (error) {
      this.logger.warn(`twitch !${command} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
