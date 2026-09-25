import type { EventsListener } from '@donation-alerts/events';
import type { OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';

import { ApiClient } from '@donation-alerts/api';
import { getTokenExpiryDate, RefreshingAuthProvider } from '@donation-alerts/auth';
import { EventsClient } from '@donation-alerts/events';
import { Injectable, Logger } from '@nestjs/common';

import type { StreamerIntegration } from '../../../../generated';
import type { DonationConnection, DonationEventInput } from '../streamers.types';

import { AppConfigService } from '../../../config';
import { DONATION_ALERTS, INTEGRATIONS } from '../config';
import { ChallengeService } from './challenge.service';
import { ChatAnnouncerService } from './chat-announcer.service';
import { IntegrationStoreService } from './integration-store.service';
import { OverlayPublisherService } from './overlay-publisher.service';
import { StreamerStatsService } from './streamer-stats.service';

@Injectable()
export class DonationListenerService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(DonationListenerService.name);
  private readonly connections = new Map<number, DonationConnection>();
  private auth: RefreshingAuthProvider | null = null;
  private events: EventsClient | null = null;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly config: AppConfigService,
    private readonly store: IntegrationStoreService,
    private readonly challenges: ChallengeService,
    private readonly announcer: ChatAnnouncerService,
    private readonly publisher: OverlayPublisherService,
    private readonly stats: StreamerStatsService
  ) {}

  onApplicationBootstrap(): void {
    const clientId = this.config.get('DONATIONALERTS_CLIENT_ID');
    const clientSecret = this.config.get('DONATIONALERTS_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      this.logger.log('DonationAlerts listener is disabled: DONATIONALERTS_CLIENT_ID is empty');

      return;
    }

    if (this.config.get('NODE_ENV') === 'test') {
      return;
    }

    this.auth = new RefreshingAuthProvider({ clientId, clientSecret, scopes: [...DONATION_ALERTS.scopes] });

    this.auth.onRefresh((externalId, token) => {
      void this.store.storeToken({
        provider: 'donationAlerts',
        externalId: String(externalId),
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: getTokenExpiryDate(token)
      });
    });

    this.events = new EventsClient({ apiClient: new ApiClient({ authProvider: this.auth }) });

    void this.sync();
    this.timer = setInterval(() => void this.sync(), INTEGRATIONS.syncIntervalMs);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
    }

    await Promise.allSettled([...this.connections.values()].map(({ listener }) => listener.remove()));
    this.connections.clear();
  }

  async sync(): Promise<void> {
    try {
      const integrations = await this.store.byProvider('donationAlerts');
      const active = new Set(integrations.map((integration) => Number(integration.externalId)));

      for (const integration of integrations) {
        if (!this.connections.has(Number(integration.externalId))) {
          await this.connect(integration);
        }
      }

      for (const [externalId, { listener }] of this.connections) {
        if (!active.has(externalId)) {
          await listener.remove();
          this.auth?.removeUser(externalId);
          this.connections.delete(externalId);
        }
      }
    } catch (error) {
      this.logger.warn(`DonationAlerts sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async connect(integration: StreamerIntegration): Promise<void> {
    if (!this.auth || !this.events || !integration.accessToken || !integration.refreshToken) {
      return;
    }

    const externalId = Number(integration.externalId);
    const expiresIn = integration.tokenExpiresAt ? Math.max(0, Math.floor((integration.tokenExpiresAt.getTime() - Date.now()) / 1000)) : 0;

    this.auth.addUser(externalId, {
      accessToken: integration.accessToken,
      refreshToken: integration.refreshToken,
      expiresIn,
      obtainmentTimestamp: Date.now(),
      scopes: [...DONATION_ALERTS.scopes]
    });

    const listener: EventsListener = await this.events.onDonation(externalId, (donation) => {
      void this.onDonation({ streamerUserId: integration.userId, donation });
    });

    this.connections.set(externalId, { userId: integration.userId, listener });
  }

  private async onDonation({ streamerUserId, donation }: DonationEventInput): Promise<void> {
    try {
      const challenge = await this.challenges.handleDonation({
        streamerUserId,
        externalId: String(donation.id),
        donorName: donation.username,
        message: donation.message,
        amount: donation.amount,
        currency: donation.currency
      });

      if (!challenge) {
        return;
      }

      const text = await this.stats.text({
        streamerUserId,
        pick: (copy) => copy.challengeActive,
        values: { title: challenge.title, donor: challenge.donorName ?? donation.username }
      });

      await Promise.all([this.announcer.announce({ streamerUserId, text }), this.publisher.publish(challenge.accountId)]);
    } catch (error) {
      this.logger.warn(`donation ${donation.id} was not processed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
