import { Module } from '@nestjs/common';

import { UserLestaAccountsModule } from '../../core';
import { ReferenceCoreModule } from '../reference';
import { FirstWinService, OwnAccountService } from './services';

@Module({
  imports: [UserLestaAccountsModule, ReferenceCoreModule],
  providers: [OwnAccountService, FirstWinService],
  exports: [OwnAccountService, FirstWinService]
})
export class AnalyticsCoreModule {}
