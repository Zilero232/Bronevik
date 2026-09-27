import { Module } from '@nestjs/common';

import { LeaderboardsController } from './leaderboards.controller';
import { LeaderboardService } from './services';

@Module({
  controllers: [LeaderboardsController],
  providers: [LeaderboardService],
  exports: [LeaderboardService]
})
export class LeaderboardsModule {}
