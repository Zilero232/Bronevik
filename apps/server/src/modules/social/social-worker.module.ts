import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { SOCIAL_QUEUE } from './config';
import { SocialProcessor, SocialSchedulesService } from './processors';
import { LeagueDivisionService, LeagueStatsService, SnapshotEventsService, WeeklyChallengeService } from './services';

@Module({
  imports: [NotificationsProducerModule, BullModule.registerQueue({ name: SOCIAL_QUEUE.name })],
  providers: [SnapshotEventsService, LeagueStatsService, LeagueDivisionService, WeeklyChallengeService, SocialProcessor, SocialSchedulesService]
})
export class SocialWorkerModule {}
