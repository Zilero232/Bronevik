import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { CommunityCoreModule } from '../community-core';
import { PlatoonService } from '../platoons';
import { RecruitingService } from '../recruiting';
import { COMMUNITY_QUEUE } from './config';
import { CommunityProcessor, CommunitySchedulesService } from './processors';

@Module({
  imports: [CommunityCoreModule, BullModule.registerQueue({ name: COMMUNITY_QUEUE.name })],
  providers: [PlatoonService, RecruitingService, CommunityProcessor, CommunitySchedulesService]
})
export class CommunityMaintenanceWorkerModule {}
