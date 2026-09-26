import { Module } from '@nestjs/common';

import { telegramBotProvider, telegramI18nProvider } from './providers';
import { TelegramSenderService } from './services/telegram-sender.service';

@Module({
  providers: [telegramBotProvider, telegramI18nProvider, TelegramSenderService],
  exports: [telegramBotProvider, telegramI18nProvider, TelegramSenderService]
})
export class TelegramCoreModule {}
