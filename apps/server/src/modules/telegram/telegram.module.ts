import { Module } from '@nestjs/common';

import { PlayersModule } from '../players';
import {
  TelegramBotService,
  TelegramChatService,
  TelegramCommandsService,
  TelegramIdentityService,
  TelegramInlineService,
  TelegramLinkService,
  TelegramLookupCommandsService,
  TelegramPlayerCommandsService,
  TelegramSettingsService,
  TelegramStatsService
} from './services';
import { TelegramCoreModule } from './telegram-core.module';
import { TelegramLinkController } from './telegram-link.controller';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [TelegramCoreModule, PlayersModule],
  controllers: [TelegramController, TelegramLinkController],
  providers: [
    TelegramBotService,
    TelegramChatService,
    TelegramCommandsService,
    TelegramIdentityService,
    TelegramInlineService,
    TelegramLinkService,
    TelegramLookupCommandsService,
    TelegramPlayerCommandsService,
    TelegramSettingsService,
    TelegramStatsService
  ],
  exports: [TelegramCoreModule]
})
export class TelegramModule {}
