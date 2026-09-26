import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { CLAN_WORKSPACE_QUEUE } from './config';
import { ClanWorkspaceProcessor, ClanWorkspaceSchedulesService } from './processors';
import { ClanAccessService, ClanEventAttendanceService, ClanEventRemindersService, ClanEventsService, OfficerReportService } from './services';

@Module({
  imports: [NotificationsProducerModule, BullModule.registerQueue({ name: CLAN_WORKSPACE_QUEUE.name })],
  providers: [
    ClanAccessService,
    ClanEventsService,
    ClanEventAttendanceService,
    ClanEventRemindersService,
    OfficerReportService,
    ClanWorkspaceProcessor,
    ClanWorkspaceSchedulesService
  ],
  exports: [OfficerReportService]
})
export class ClanWorkspaceWorkerModule {}
