import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { BotCommandsModule } from '../bot-commands';
import { DiscordCoreModule } from './discord-core.module';
import { DiscordController } from './discord.controller';
import {
  DiscordCopyService,
  DiscordGatewayService,
  DiscordGuildsService,
  DiscordInteractionsService,
  DiscordRolesService,
  DiscordStatusService
} from './services';

@Module({
  imports: [BillingCoreModule, BotCommandsModule, DiscordCoreModule],
  controllers: [DiscordController],
  providers: [DiscordCopyService, DiscordGatewayService, DiscordGuildsService, DiscordInteractionsService, DiscordRolesService, DiscordStatusService]
})
export class DiscordModule {}
