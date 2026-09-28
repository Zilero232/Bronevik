import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { ReferenceCoreModule } from '../reference';
import { GOAL_PROGRESS_QUEUE } from './config';
import { GoalProgressProcessor, GoalProgressSchedulesService } from './processors';
import { GoalProgressService } from './services';

@Module({
  imports: [NotificationsProducerModule, ReferenceCoreModule, BullModule.registerQueue({ name: GOAL_PROGRESS_QUEUE.name })],
  providers: [GoalProgressService, GoalProgressProcessor, GoalProgressSchedulesService]
})
export class MeWorkerModule {}
