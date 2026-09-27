import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { MissionsModule } from '../missions';
import { PlayersModule } from '../players';
import { AnalyticsCoreModule } from './analytics-core.module';
import { AnalyticsController } from './analytics.controller';
import {
  AnalyticsOverviewService,
  BattleReviewService,
  HonestRngService,
  MapAdvisorService,
  PlatoonChemistryService,
  PlaylistService,
  TankAnalyticsService
} from './services';

@Module({
  imports: [AnalyticsCoreModule, BillingCoreModule, PlayersModule, MissionsModule],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsOverviewService,
    TankAnalyticsService,
    MapAdvisorService,
    PlatoonChemistryService,
    HonestRngService,
    BattleReviewService,
    PlaylistService
  ],
  exports: [PlaylistService, AnalyticsCoreModule]
})
export class AnalyticsModule {}
