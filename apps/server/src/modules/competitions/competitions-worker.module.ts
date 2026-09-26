import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { COMPETITION_QUEUE } from './config';
import { CompetitionsProcessor, CompetitionsSchedulesService } from './processors';
import { CompetitionScoringService } from './services';

@Module({
  imports: [NotificationsProducerModule, BullModule.registerQueue({ name: COMPETITION_QUEUE.name })],
  providers: [CompetitionScoringService, CompetitionsProcessor, CompetitionsSchedulesService]
})
export class CompetitionsWorkerModule {}
