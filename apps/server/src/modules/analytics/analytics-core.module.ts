import { Module } from '@nestjs/common';

import { ReferenceCoreModule } from '../reference';
import { FirstWinService, OwnAccountService } from './services';

@Module({
  imports: [ReferenceCoreModule],
  providers: [OwnAccountService, FirstWinService],
  exports: [OwnAccountService, FirstWinService]
})
export class AnalyticsCoreModule {}
