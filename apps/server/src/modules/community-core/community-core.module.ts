import { Module } from '@nestjs/common';

import { CommunityAccountsService } from './services';

@Module({
  providers: [CommunityAccountsService],
  exports: [CommunityAccountsService]
})
export class CommunityCoreModule {}
