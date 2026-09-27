import { Module } from '@nestjs/common';

import { PurgeProcessor } from './processors/purge.processor';
import { PurgeGuardModule } from './purge-guard.module';
import { JobMetricRetentionService, PurgeService } from './services';

@Module({
  imports: [PurgeGuardModule],
  providers: [PurgeService, JobMetricRetentionService, PurgeProcessor],
  exports: [PurgeGuardModule]
})
export class PurgeModule {}
