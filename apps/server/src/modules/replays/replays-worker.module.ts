import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ObjectStorageModule } from '../../core';
import { REPLAYS_QUEUE } from './config';
import { ReplaysProcessor, ReplaysSchedulesService } from './processors';
import { BestOfWeekService, HeatmapService, ReplayParseService } from './services';

@Module({
  imports: [ObjectStorageModule.register({ rootEnv: 'REPLAY_STORAGE_DIR' }), BullModule.registerQueue({ name: REPLAYS_QUEUE.name })],
  providers: [ReplayParseService, HeatmapService, BestOfWeekService, ReplaysProcessor, ReplaysSchedulesService]
})
export class ReplaysWorkerModule {}
