import { Module } from '@nestjs/common';

import { PurgeProcessor } from './processors/purge.processor';
import { PurgeGuardModule } from './purge-guard.module';
import { PurgeService } from './services';

@Module({
  imports: [PurgeGuardModule],
  providers: [PurgeService, PurgeProcessor],
  exports: [PurgeGuardModule]
})
export class PurgeModule {}
