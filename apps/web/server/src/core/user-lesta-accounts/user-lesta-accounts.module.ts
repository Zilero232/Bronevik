import { Module } from '@nestjs/common';

import { UserLestaAccountsService } from './user-lesta-accounts.service';

@Module({
  providers: [UserLestaAccountsService],
  exports: [UserLestaAccountsService]
})
export class UserLestaAccountsModule {}
