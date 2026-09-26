import { Module } from '@nestjs/common';

import { PlayersModule } from '../players';
import { BotAccountsService, BotRepliesService, BotStatsService } from './services';

@Module({
  imports: [PlayersModule],
  providers: [BotAccountsService, BotRepliesService, BotStatsService],
  exports: [BotAccountsService, BotRepliesService, BotStatsService]
})
export class BotCommandsModule {}
