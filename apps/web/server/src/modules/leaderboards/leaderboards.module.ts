import { Module } from '@nestjs/common';

import { LeaderboardsController } from './leaderboards.controller';
import { LeaderboardService, OfficialRatingsService } from './services';

@Module({
  controllers: [LeaderboardsController],
  providers: [LeaderboardService, OfficialRatingsService],
  exports: [LeaderboardService]
})
export class LeaderboardsModule {}
