import { Module } from '@nestjs/common';

import { AggregateProcessor } from './processors/aggregate.processor';
import {
  AccountRatingsService,
  BuildUsageService,
  LearningCurveService,
  ReferenceTablesService,
  ServerStatsService,
  TankEconomyService,
  TankPercentilesService,
  TierMaintenanceService
} from './services';

@Module({
  providers: [
    ReferenceTablesService,
    AccountRatingsService,
    ServerStatsService,
    TankPercentilesService,
    TierMaintenanceService,
    TankEconomyService,
    LearningCurveService,
    BuildUsageService,
    AggregateProcessor
  ]
})
export class AggregatesModule {}
