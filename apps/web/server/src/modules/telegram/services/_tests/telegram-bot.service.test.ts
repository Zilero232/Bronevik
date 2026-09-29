import type { I18n } from '@grammyjs/i18n';
import type { Bot } from 'grammy';
import type { Update } from 'grammy/types';

import { ConfigService } from '@nestjs/config';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Env } from '../../../../config/env';
import type { BotContext } from '../../telegram.types';
import type { TelegramChatService } from '../telegram-chat.service';
import type { TelegramCommandRegistry } from '../telegram-command-registry.service';
import type { TelegramCommandsService } from '../telegram-commands.service';
import type { TelegramInlineService } from '../telegram-inline.service';
import type { TelegramSettingsService } from '../telegram-settings.service';

import { AppConfigService } from '../../../../config';
import { TelegramBotService } from '../telegram-bot.service';

const SECRET = 'webhook-secret-of-the-bot';
const update = mock<Update>({ update_id: 1 });

const createBot = (secret = SECRET) => {
  const bot = mockDeep<Bot<BotContext>>();
  const service = new TelegramBotService(
    bot,
    mock<I18n<BotContext>>(),
    new AppConfigService(new ConfigService<Env, true>({ TELEGRAM_WEBHOOK_SECRET: secret })),
    mock<TelegramChatService>(),
    mock<TelegramCommandsService>({ commands: [] }),
    mock<TelegramInlineService>(),
    mock<TelegramSettingsService>(),
    mock<TelegramCommandRegistry>()
  );

  return { bot, service };
};

describe('TelegramBotService.handleWebhook', () => {
  it('hands an update with the right secret to the bot', async () => {
    const { bot, service } = createBot();

    await service.handleWebhook({ update, secret: SECRET });

    expect(bot.handleUpdate).toHaveBeenCalledWith(update);
  });

  it('drops an update with a wrong or missing secret', async () => {
    const { bot, service } = createBot();

    await service.handleWebhook({ update, secret: `${SECRET}-forged` });
    await service.handleWebhook({ update, secret: undefined });

    expect(bot.handleUpdate).not.toHaveBeenCalled();
  });

  it('drops every update while no webhook secret is configured', async () => {
    const { bot, service } = createBot('');

    await service.handleWebhook({ update, secret: '' });

    expect(bot.handleUpdate).not.toHaveBeenCalled();
  });
});
