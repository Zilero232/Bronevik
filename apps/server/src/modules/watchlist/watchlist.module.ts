import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { BotCommandsModule } from '../bot-commands';
import { TelegramCoreModule } from '../telegram';
import { WatchlistActivityService, WatchlistBotService, WatchlistService } from './services';
import { WatchlistController } from './watchlist.controller';

@Module({
  imports: [BillingCoreModule, BotCommandsModule, TelegramCoreModule],
  controllers: [WatchlistController],
  providers: [WatchlistActivityService, WatchlistService, WatchlistBotService]
})
export class WatchlistModule {}
