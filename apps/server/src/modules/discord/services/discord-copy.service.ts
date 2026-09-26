import { Injectable } from '@nestjs/common';

import type { DiscordTextInput } from '../discord.types';
import type { LocalizedDescription } from '../lib';

import { BOT_LOCALE, createFluentStore } from '../../bot-commands';
import { DISCORD_LOCALE_FILES } from '../config';

@Injectable()
export class DiscordCopyService {
  private readonly i18n = createFluentStore({ files: DISCORD_LOCALE_FILES });

  t({ locale, key, vars }: DiscordTextInput): string {
    return this.i18n.t(locale, key, vars);
  }

  describe(key: string): LocalizedDescription {
    return {
      description: this.i18n.t('en', key),
      description_localizations: { ru: this.i18n.t(BOT_LOCALE.fallbackLocale, key) }
    };
  }
}
