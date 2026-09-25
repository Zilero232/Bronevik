import { Module } from '@nestjs/common';

import { PurgeModule } from '../purge';
import { ClansProcessor } from './processors/clans.processor';
import { ClanDispatchService, ClanHistoryService, ClanSyncService } from './services';

@Module({
  imports: [PurgeModule],
  providers: [ClanDispatchService, ClanSyncService, ClanHistoryService, ClansProcessor]
})
export class ClansModule {}
