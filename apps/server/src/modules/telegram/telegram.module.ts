import { Module } from '@nestjs/common';

import { AnalyticsModule } from '../analytics';
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
  TelegramPlaylistCommandsService,
  TelegramSettingsService,
  TelegramStatsService
} from './services';
import { TelegramCoreModule } from './telegram-core.module';
import { TelegramLinkController } from './telegram-link.controller';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [TelegramCoreModule, PlayersModule, MissionsModule, AnalyticsModule],
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
    TelegramPlaylistCommandsService,
    TelegramSettingsService,
    TelegramStatsService
  ],
  exports: [TelegramCoreModule]
})
export class TelegramModule {}
