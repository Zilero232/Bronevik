import { Module } from '@nestjs/common';

import { LestaAccountsService, TelegramAccountsService } from './services';

@Module({
  providers: [LestaAccountsService, TelegramAccountsService],
  exports: [LestaAccountsService, TelegramAccountsService]
})
export class AuthStoresModule {}
