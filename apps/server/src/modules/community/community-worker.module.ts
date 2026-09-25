import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { COMMUNITY_QUEUE } from './config';
import { CommunityProcessor, CommunitySchedulesService } from './processors';
import { CoachingService, CommunityAccountsService, PlatoonService, RecruitingService } from './services';

@Module({
  imports: [BillingCoreModule, BullModule.registerQueue({ name: COMMUNITY_QUEUE.name })],
  providers: [CommunityAccountsService, PlatoonService, RecruitingService, CoachingService, CommunityProcessor, CommunitySchedulesService]
})
export class CommunityWorkerModule {}
