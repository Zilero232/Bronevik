import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { PROGRESSION_QUEUE } from './config';
import { ProgressionProcessor, ProgressionSchedulesService } from './processors';
import { ProgressionCoreModule } from './progression-core.module';
import { ProgressionRunService, SeasonService } from './services';

@Module({
  imports: [BillingCoreModule, ProgressionCoreModule, BullModule.registerQueue({ name: PROGRESSION_QUEUE.name })],
  providers: [SeasonService, ProgressionRunService, ProgressionProcessor, ProgressionSchedulesService]
})
export class ProgressionWorkerModule {}
