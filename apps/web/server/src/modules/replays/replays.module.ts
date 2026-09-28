import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ObjectStorageModule } from '../../core';
import { BillingCoreModule } from '../billing';
import { ModModule } from '../mod';
import { REPLAYS_QUEUE } from './config';
import { ModReplaysController } from './mod-replays.controller';
import { ReplaysController } from './replays.controller';
import { HeatmapService, ReplayOwnerService, ReplayQueryService, ReplayStatusService, ReplayUploadService } from './services';

@Module({
  imports: [
    BillingCoreModule,
    ModModule,
    ObjectStorageModule.register({ rootEnv: 'REPLAY_STORAGE_DIR' }),
    BullModule.registerQueue({ name: REPLAYS_QUEUE.name })
  ],
  controllers: [ReplaysController, ModReplaysController],
  providers: [ReplayUploadService, ReplayQueryService, ReplayOwnerService, ReplayStatusService, HeatmapService]
})
export class ReplaysModule {}
