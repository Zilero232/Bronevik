import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { ClanWorkspaceWorkerModule } from '../clan-workspace';
import { DISCORD_QUEUE } from './config';
import { DiscordCoreModule } from './discord-core.module';
import { DiscordProcessor, DiscordSchedulesService } from './processors';
import { DiscordCopyService, DiscordRemindersService, DiscordReportService, DiscordRolesService } from './services';

@Module({
  imports: [BillingCoreModule, ClanWorkspaceWorkerModule, DiscordCoreModule, BullModule.registerQueue({ name: DISCORD_QUEUE.name })],
  providers: [DiscordCopyService, DiscordRemindersService, DiscordReportService, DiscordRolesService, DiscordProcessor, DiscordSchedulesService]
})
export class DiscordWorkerModule {}
