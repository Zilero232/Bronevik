import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { MeMissionsController } from './me-missions.controller';
import { MissionsController } from './missions.controller';
import { MissionCatalogService, MissionPlanService, MissionProgressService, MissionTanksService } from './services';

@Module({
  imports: [BillingCoreModule],
  controllers: [MissionsController, MeMissionsController],
  providers: [MissionCatalogService, MissionTanksService, MissionProgressService, MissionPlanService],
  exports: [MissionProgressService]
})
export class MissionsModule {}
