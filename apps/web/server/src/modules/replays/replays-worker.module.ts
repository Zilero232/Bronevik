import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ObjectStorageModule } from '../../core';
import { NotificationsProducerModule } from '../notifications';
import { REPLAY_FILES, REPLAYS_QUEUE } from './config';
import { ReplaysProcessor, ReplaysSchedulesService } from './processors';
import { BestOfWeekService, HeatmapService, ReplayOverflowService, ReplayParseService, ReplayTagBackfillService } from './services';

@Module({
  imports: [
    NotificationsProducerModule,
    ObjectStorageModule.register({ root: REPLAY_FILES.root }),
    BullModule.registerQueue({ name: REPLAYS_QUEUE.name })
  ],
  providers: [
    ReplayParseService,
    HeatmapService,
    BestOfWeekService,
    ReplayOverflowService,
    ReplayTagBackfillService,
    ReplaysProcessor,
    ReplaysSchedulesService
  ]
})
export class ReplaysWorkerModule {}
