import { Module } from '@nestjs/common';

import { BestBattlesController } from './best-battles.controller';
import { BestBattleLookupsService, BestBattlesFacetsService, BestBattlesFeedService } from './services';

@Module({
  controllers: [BestBattlesController],
  providers: [BestBattleLookupsService, BestBattlesFeedService, BestBattlesFacetsService]
})
export class BestBattlesModule {}
