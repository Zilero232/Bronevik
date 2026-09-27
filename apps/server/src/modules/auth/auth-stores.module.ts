import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { CommunityCoreModule } from '../community-core';
import { AccountPurgeService, LestaAccountsService, TelegramAccountsService } from './services';

@Module({
  imports: [BillingCoreModule, CommunityCoreModule],
  providers: [LestaAccountsService, TelegramAccountsService, AccountPurgeService],
  exports: [LestaAccountsService, TelegramAccountsService, AccountPurgeService]
})
export class AuthStoresModule {}
