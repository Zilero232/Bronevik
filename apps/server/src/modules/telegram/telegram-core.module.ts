import { Module } from '@nestjs/common';

import { telegramBotProvider, telegramI18nProvider } from './providers';
import { TelegramCommandRegistry } from './services/telegram-command-registry.service';
import { TelegramSenderService } from './services/telegram-sender.service';

@Module({
  providers: [telegramBotProvider, telegramI18nProvider, TelegramSenderService, TelegramCommandRegistry],
  exports: [telegramBotProvider, telegramI18nProvider, TelegramSenderService, TelegramCommandRegistry]
})
export class TelegramCoreModule {}
