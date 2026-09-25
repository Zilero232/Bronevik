import { Module } from '@nestjs/common';

import { AggregateProcessor } from './processors/aggregate.processor';
import { AccountRatingsService, ReferenceTablesService, ServerStatsService, TankPercentilesService, TierMaintenanceService } from './services';

@Module({
  providers: [ReferenceTablesService, AccountRatingsService, ServerStatsService, TankPercentilesService, TierMaintenanceService, AggregateProcessor]
})
export class AggregatesModule {}
