import { Module } from '@nestjs/common';

import { PurgeGuardModule } from '../collector';
import { ClansController } from './clans.controller';
import { ClanListService, ClanPageService, ClanResolverService, ClanStrongholdService } from './services';

@Module({
  imports: [PurgeGuardModule],
  controllers: [ClansController],
  providers: [ClanResolverService, ClanPageService, ClanListService, ClanStrongholdService],
  exports: [ClanResolverService, ClanPageService, ClanListService]
})
export class ClansModule {}
