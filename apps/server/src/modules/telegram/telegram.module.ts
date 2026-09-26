import { Module } from '@nestjs/common';

import { AnalyticsModule } from '../analytics';
import { BotCommandsModule } from '../bot-commands';
import { MissionsModule } from '../missions';
import {
  TelegramBotService,
  TelegramChatService,
  TelegramCommandsService,
  TelegramIdentityService,
  TelegramInlineService,
  TelegramLinkService,
  TelegramMissionCommandsService,
  TelegramPlaylistCommandsService,
  TelegramSettingsService,
  TelegramSharedCommandsService
} from './services';
import { TelegramCoreModule } from './telegram-core.module';
import { TelegramLinkController } from './telegram-link.controller';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [TelegramCoreModule, BotCommandsModule, MissionsModule, AnalyticsModule],
  controllers: [TelegramController, TelegramLinkController],
  providers: [
    TelegramBotService,
    TelegramChatService,
    TelegramCommandsService,
    TelegramIdentityService,
    TelegramInlineService,
    TelegramLinkService,
    TelegramMissionCommandsService,
    TelegramPlaylistCommandsService,
    TelegramSettingsService,
    TelegramSharedCommandsService
  ],
  exports: [TelegramCoreModule]
})
export class TelegramModule {}
