import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ObjectStorageModule } from '../../core';
import { NotificationsProducerModule } from '../notifications';
import { REPLAYS_QUEUE } from './config';
import { ReplaysProcessor, ReplaysSchedulesService } from './processors';
import { BestOfWeekService, HeatmapService, ReplayOverflowService, ReplayParseService } from './services';

@Module({
  imports: [
    NotificationsProducerModule,
    ObjectStorageModule.register({ rootEnv: 'REPLAY_STORAGE_DIR' }),
    BullModule.registerQueue({ name: REPLAYS_QUEUE.name })
  ],
  providers: [ReplayParseService, HeatmapService, BestOfWeekService, ReplayOverflowService, ReplaysProcessor, ReplaysSchedulesService]
})
export class ReplaysWorkerModule {}
