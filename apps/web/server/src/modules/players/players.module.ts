import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { PlayersController } from './players.controller';
import {
  PlayerAchievementsService,
  PlayerHistoryService,
  PlayerInsightsService,
  PlayerMarksService,
  PlayerPlaytimeService,
  PlayerResolverService,
  PlayerSessionsService,
  PlayerSummaryService,
  PlayerTanksService,
  PlayerViewsService
} from './services';

@Module({
  imports: [BillingCoreModule],
  controllers: [PlayersController],
  providers: [
    PlayerAchievementsService,
    PlayerResolverService,
    PlayerSummaryService,
    PlayerTanksService,
    PlayerHistoryService,
    PlayerSessionsService,
    PlayerMarksService,
    PlayerInsightsService,
    PlayerPlaytimeService,
    PlayerViewsService
  ],
  exports: [PlayerResolverService, PlayerSummaryService, PlayerTanksService, PlayerHistoryService, PlayerSessionsService, PlayerMarksService]
})
export class PlayersModule {}
