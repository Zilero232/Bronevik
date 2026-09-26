import { Module } from '@nestjs/common';

import { MissionsModule } from '../missions';
import { PlayersModule } from '../players';
import {
  TelegramBotService,
  TelegramChatService,
  TelegramCommandsService,
  TelegramIdentityService,
  TelegramInlineService,
  TelegramLinkService,
  TelegramLookupCommandsService,
  TelegramMissionCommandsService,
  TelegramPlayerCommandsService,
  TelegramSettingsService,
  TelegramStatsService
} from './services';
import { TelegramCoreModule } from './telegram-core.module';
import { TelegramLinkController } from './telegram-link.controller';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [TelegramCoreModule, PlayersModule, MissionsModule],
  controllers: [TelegramController, TelegramLinkController],
  providers: [
    TelegramBotService,
    TelegramChatService,
    TelegramCommandsService,
    TelegramIdentityService,
    TelegramInlineService,
    TelegramLinkService,
    TelegramLookupCommandsService,
    TelegramMissionCommandsService,
    TelegramPlayerCommandsService,
    TelegramSettingsService,
    TelegramStatsService
  ],
  exports: [TelegramCoreModule]
})
export class TelegramModule {}
