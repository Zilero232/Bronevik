import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { BotCommandsModule } from '../bot-commands';
import { DiscordController } from './discord.controller';
import { discordApiProvider } from './providers';
import {
  DiscordCopyService,
  DiscordGatewayService,
  DiscordGuildsService,
  DiscordInteractionsService,
  DiscordRolesService,
  DiscordStatusService
} from './services';

@Module({
  imports: [BillingCoreModule, BotCommandsModule],
  controllers: [DiscordController],
  providers: [
    discordApiProvider,
    DiscordCopyService,
    DiscordGatewayService,
    DiscordGuildsService,
    DiscordInteractionsService,
    DiscordRolesService,
    DiscordStatusService
  ]
})
export class DiscordModule {}
