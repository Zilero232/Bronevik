import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { NotificationsProducerModule } from '../notifications';
import {
  FeedService,
  FollowService,
  LeagueService,
  LeagueStatsService,
  SignatureService,
  SnapshotEventsService,
  WeeklyChallengeService,
  WrappedService
} from './services';
import { SocialController } from './social.controller';

@Module({
  imports: [BillingCoreModule, NotificationsProducerModule],
  controllers: [SocialController],
  providers: [
    SnapshotEventsService,
    FollowService,
    FeedService,
    LeagueStatsService,
    LeagueService,
    WeeklyChallengeService,
    SignatureService,
    WrappedService
  ]
})
export class SocialModule {}
