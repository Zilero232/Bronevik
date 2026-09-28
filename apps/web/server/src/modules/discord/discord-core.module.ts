import { Module } from '@nestjs/common';

import { DISCORD_TOKENS } from './config';
import { discordApiProvider } from './providers';
import { DiscordSenderService } from './services';

@Module({
  providers: [discordApiProvider, DiscordSenderService],
  exports: [DISCORD_TOKENS.api, DiscordSenderService]
})
export class DiscordCoreModule {}
