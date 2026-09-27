import { Module } from '@nestjs/common';

import { CommunityAccountsService, CommunityContentService } from './services';

@Module({
  providers: [CommunityAccountsService, CommunityContentService],
  exports: [CommunityAccountsService, CommunityContentService]
})
export class CommunityCoreModule {}
