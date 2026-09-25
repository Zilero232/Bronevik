import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import {
  FeedService,
  FollowService,
  LeagueService,
  SignatureService,
  SnapshotEventsService,
  WeeklyChallengeService,
  WrappedService
} from './services';
import { SocialController } from './social.controller';

@Module({
  imports: [NotificationsProducerModule],
  controllers: [SocialController],
  providers: [SnapshotEventsService, FollowService, FeedService, LeagueService, WeeklyChallengeService, SignatureService, WrappedService]
})
export class SocialModule {}
