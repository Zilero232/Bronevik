import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { CLAN_WORKSPACE_QUEUE } from './config';
import { ClanWorkspaceProcessor, ClanWorkspaceSchedulesService } from './processors';
import { ClanAccessService, ClanEventsService, OfficerReportService } from './services';

@Module({
  imports: [NotificationsProducerModule, BullModule.registerQueue({ name: CLAN_WORKSPACE_QUEUE.name })],
  providers: [ClanAccessService, ClanEventsService, OfficerReportService, ClanWorkspaceProcessor, ClanWorkspaceSchedulesService]
})
export class ClanWorkspaceWorkerModule {}
