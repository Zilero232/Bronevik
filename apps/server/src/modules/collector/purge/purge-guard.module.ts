import { Module } from '@nestjs/common';

import { PurgeGuardService } from './services';

@Module({
  providers: [PurgeGuardService],
  exports: [PurgeGuardService]
})
export class PurgeGuardModule {}
