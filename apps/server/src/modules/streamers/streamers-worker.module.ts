import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { ReferenceModule } from '../reference';
import { STREAMERS_QUEUE } from './config';
import { StreamersProcessor, StreamersSchedulesService } from './processors';
import {
  ChallengeFeedService,
  ChallengeService,
  ChatAnnouncerService,
  DonationListenerService,
  IntegrationStoreService,
  OverlayPublisherService,
  StreamerStatsService,
  TwitchChatService,
  VkLiveChatService
} from './services';

@Module({
  imports: [NotificationsProducerModule, ReferenceModule, BullModule.registerQueue({ name: STREAMERS_QUEUE.name })],
  providers: [
    ChallengeService,
    ChallengeFeedService,
    ChatAnnouncerService,
    DonationListenerService,
    IntegrationStoreService,
    OverlayPublisherService,
    StreamerStatsService,
    TwitchChatService,
    VkLiveChatService,
    StreamersProcessor,
    StreamersSchedulesService
  ]
})
export class StreamersWorkerModule {}
