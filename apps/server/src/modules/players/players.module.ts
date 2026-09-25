import { Module } from '@nestjs/common';

import { PlayersController } from './players.controller';
import {
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
  controllers: [PlayersController],
  providers: [
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
