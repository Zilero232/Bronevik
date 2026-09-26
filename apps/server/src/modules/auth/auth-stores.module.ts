import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { LestaAccountsService, TelegramAccountsService } from './services';

@Module({
  imports: [BillingCoreModule],
  providers: [LestaAccountsService, TelegramAccountsService],
  exports: [LestaAccountsService, TelegramAccountsService]
})
export class AuthStoresModule {}
