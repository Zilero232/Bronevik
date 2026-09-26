import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { BotCommandsModule } from '../bot-commands';
import { ModModule } from '../mod';
import { ProgressionCoreModule } from '../progression';
import { AdminStreamersController } from './admin-streamers.controller';
import { ModSettingsController } from './mod-settings.controller';
import { OverlaysController } from './overlays.controller';
import {
  ChallengeService,
  IntegrationsService,
  IntegrationStoreService,
  LivePlatformsService,
  OAuthStateService,
  OverlayDataService,
  OverlayPublisherService,
  OverlayService,
  OverlayStreamService,
  SettingsAggregateService,
  SettingsShareService,
  StreamerCardsService,
  StreamerClaimService,
  StreamerDirectoryService,
  StreamerFollowService,
  StreamerProfileService,
  StreamerSettingsService,
  TwitchPanelService
} from './services';
import { StreamersController } from './streamers.controller';

@Module({
  imports: [BillingCoreModule, BotCommandsModule, ProgressionCoreModule, ModModule],
  controllers: [OverlaysController, StreamersController, AdminStreamersController, ModSettingsController],
  providers: [
    StreamerProfileService,
    StreamerCardsService,
    StreamerDirectoryService,
    StreamerClaimService,
    StreamerSettingsService,
    StreamerFollowService,
    TwitchPanelService,
    SettingsAggregateService,
    SettingsShareService,
    LivePlatformsService,
    OverlayService,
    OverlayDataService,
    OverlayPublisherService,
    OverlayStreamService,
    ChallengeService,
    IntegrationStoreService,
    IntegrationsService,
    OAuthStateService
  ]
})
export class StreamersModule {}
