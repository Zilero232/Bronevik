import { Module } from '@nestjs/common';

import { PurgeProcessor } from './processors/purge.processor';
import { PurgeGuardService, PurgeService } from './services';

@Module({
  providers: [PurgeService, PurgeGuardService, PurgeProcessor],
  exports: [PurgeGuardService]
})
export class PurgeModule {}
