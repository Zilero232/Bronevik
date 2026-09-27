import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';

import { AppConfigService } from '../../../config';
import { DISCORD, DISCORD_TOKENS } from '../config';

export const discordApiProvider = {
  provide: DISCORD_TOKENS.api,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService): API | null => {
    const token = config.get('DISCORD_BOT_TOKEN');

    return token ? new API(new REST({ version: DISCORD.restVersion }).setToken(token)) : null;
  }
};
