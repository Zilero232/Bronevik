import { Module } from '@nestjs/common';

import { ClansModule } from '../clans';
import { DeveloperModule } from '../developer';
import { LeaderboardsModule } from '../leaderboards';
import { MarksModule } from '../marks';
import { PlayersModule } from '../players';
import { TanksModule } from '../tanks';
import { ApiKeyGuard } from './guards';
import { ApiUsageInterceptor } from './interceptors';
import { ApiRateLimitService, ApiUsageService } from './services';
import { V1ClansController } from './v1-clans.controller';
import { V1LeaderboardsController } from './v1-leaderboards.controller';
import { V1MarksController } from './v1-marks.controller';
import { V1PlayersController } from './v1-players.controller';
import { V1TanksController } from './v1-tanks.controller';

@Module({
  imports: [DeveloperModule, PlayersModule, TanksModule, MarksModule, ClansModule, LeaderboardsModule],
  controllers: [V1PlayersController, V1TanksController, V1MarksController, V1ClansController, V1LeaderboardsController],
  providers: [ApiRateLimitService, ApiUsageService, ApiKeyGuard, ApiUsageInterceptor]
})
export class PublicApiModule {}
