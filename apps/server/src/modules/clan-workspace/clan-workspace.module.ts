import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { ClanWorkspaceController } from './clan-workspace.controller';
import { ClanAccessService, ClanEventsService, OfficerReportService, RecruitFunnelService, WorkspaceService } from './services';

@Module({
  imports: [NotificationsProducerModule],
  controllers: [ClanWorkspaceController],
  providers: [ClanAccessService, WorkspaceService, ClanEventsService, RecruitFunnelService, OfficerReportService]
})
export class ClanWorkspaceModule {}
