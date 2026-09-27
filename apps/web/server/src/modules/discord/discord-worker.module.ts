import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { ClanWorkspaceWorkerModule } from '../clan-workspace';
import { DISCORD_QUEUE } from './config';
import { DiscordProcessor, DiscordSchedulesService } from './processors';
import { discordApiProvider } from './providers';
import { DiscordCopyService, DiscordRemindersService, DiscordReportService, DiscordRolesService } from './services';

@Module({
  imports: [BillingCoreModule, ClanWorkspaceWorkerModule, BullModule.registerQueue({ name: DISCORD_QUEUE.name })],
  providers: [
    discordApiProvider,
    DiscordCopyService,
    DiscordRemindersService,
    DiscordReportService,
    DiscordRolesService,
    DiscordProcessor,
    DiscordSchedulesService
  ]
})
export class DiscordWorkerModule {}
