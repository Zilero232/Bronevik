import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { CoachingPaymentService } from '../coaching';
import { CommunityCoreModule } from '../community-core';
import { PlatoonService } from '../platoons';
import { RecruitingService } from '../recruiting';
import { COMMUNITY_QUEUE } from './config';
import { CommunityProcessor, CommunitySchedulesService } from './processors';

@Module({
  imports: [BillingCoreModule, CommunityCoreModule, BullModule.registerQueue({ name: COMMUNITY_QUEUE.name })],
  providers: [PlatoonService, RecruitingService, CoachingPaymentService, CommunityProcessor, CommunitySchedulesService]
})
export class CommunityMaintenanceWorkerModule {}
