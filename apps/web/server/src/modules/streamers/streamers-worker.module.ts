import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HttpModule } from '../../core';
import { NotificationsProducerModule } from '../notifications';
import { ReferenceCoreModule } from '../reference';
import { STREAMERS_QUEUE } from './config';
import { StreamersProcessor, StreamersSchedulesService } from './processors';
import {
  ChallengeFeedService,
  ChallengeService,
  ChatAnnouncerService,
  DonationAlertsSdkService,
  DonationListenerService,
  FeedReaderService,
  IntegrationStoreService,
  LivePlatformsService,
  LiveStatusService,
  OverlayPublisherService,
  SettingsAggregateService,
  StreamerStatsService,
  TwitchChatService,
  TwitchPredictionsService,
  TwitchSdkService,
  VkLiveChatService
} from './services';

@Module({
  imports: [HttpModule, NotificationsProducerModule, ReferenceCoreModule, BullModule.registerQueue({ name: STREAMERS_QUEUE.name })],
  providers: [
    ChallengeService,
    ChallengeFeedService,
    ChatAnnouncerService,
    DonationAlertsSdkService,
    DonationListenerService,
    FeedReaderService,
    IntegrationStoreService,
    LivePlatformsService,
    LiveStatusService,
    OverlayPublisherService,
    SettingsAggregateService,
    StreamerStatsService,
    TwitchChatService,
    TwitchPredictionsService,
    TwitchSdkService,
    VkLiveChatService,
    StreamersProcessor,
    StreamersSchedulesService
  ]
})
export class StreamersWorkerModule {}
