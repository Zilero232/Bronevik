import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HONEST_RNG_QUEUE } from './config';
import { HonestRngProcessor, HonestRngSchedulesService } from './processors';
import { RngAggregateService } from './services';

@Module({
  imports: [BullModule.registerQueue({ name: HONEST_RNG_QUEUE.name })],
  providers: [RngAggregateService, HonestRngProcessor, HonestRngSchedulesService]
})
export class HonestRngWorkerModule {}
