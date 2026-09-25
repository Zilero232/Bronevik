import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { REPLAYS_QUEUE } from './config';
import { ReplaysProcessor, ReplaysSchedulesService } from './processors';
import { BestOfWeekService, HeatmapService, ReplayParseService } from './services';
import { ReplayStorageModule } from './storage';

@Module({
  imports: [ReplayStorageModule, BullModule.registerQueue({ name: REPLAYS_QUEUE.name })],
  providers: [ReplayParseService, HeatmapService, BestOfWeekService, ReplaysProcessor, ReplaysSchedulesService]
})
export class ReplaysWorkerModule {}
