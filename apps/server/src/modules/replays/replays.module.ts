import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ModModule } from '../mod';
import { REPLAYS_QUEUE } from './config';
import { ReplaysController } from './replays.controller';
import { HeatmapService, ReplayOwnerService, ReplayQueryService, ReplayUploadService } from './services';
import { ReplayStorageModule } from './storage';

@Module({
  imports: [ModModule, ReplayStorageModule, BullModule.registerQueue({ name: REPLAYS_QUEUE.name })],
  controllers: [ReplaysController],
  providers: [ReplayUploadService, ReplayQueryService, ReplayOwnerService, HeatmapService]
})
export class ReplaysModule {}
