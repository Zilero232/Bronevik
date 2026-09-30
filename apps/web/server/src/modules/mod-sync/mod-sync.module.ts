import { Module } from '@nestjs/common';

import { ModModule } from '../mod';
import { ModSyncAccountController } from './mod-sync-account.controller';
import { ModSyncController } from './mod-sync.controller';
import { ModSyncService } from './services';

@Module({
  imports: [ModModule],
  controllers: [ModSyncController, ModSyncAccountController],
  providers: [ModSyncService],
  exports: [ModSyncService]
})
export class ModSyncModule {}
