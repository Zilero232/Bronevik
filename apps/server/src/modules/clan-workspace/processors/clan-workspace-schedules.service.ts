import { Injectable } from '@nestjs/common';

import { JobSchedulesService } from '../../../common/schedules';
import { CLAN_WORKSPACE_QUEUE, CLAN_WORKSPACE_SCHEDULES } from '../config';

@Injectable()
export class ClanWorkspaceSchedulesService extends JobSchedulesService({
  queue: CLAN_WORKSPACE_QUEUE.name,
  schedules: CLAN_WORKSPACE_SCHEDULES,
  label: 'clan workspace'
}) {}
