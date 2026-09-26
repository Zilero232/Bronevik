import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { SUPERTEST_QUEUE } from './config';
import { SupertestProcessor, SupertestSchedulesService } from './processors';
import { SupertestScrapeService, SupertestStoreService } from './services';

@Module({
  imports: [BullModule.registerQueue({ name: SUPERTEST_QUEUE.name })],
  providers: [SupertestStoreService, SupertestScrapeService, SupertestProcessor, SupertestSchedulesService]
})
export class SupertestWorkerModule {}
