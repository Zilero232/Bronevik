import { Module } from '@nestjs/common';

import { PurgeProcessor } from './processors/purge.processor';
import { PurgeGuardModule } from './purge-guard.module';
import { PurgeService, RetentionService } from './services';

@Module({
  imports: [PurgeGuardModule],
  providers: [PurgeService, RetentionService, PurgeProcessor],
  exports: [PurgeGuardModule]
})
export class PurgeModule {}
