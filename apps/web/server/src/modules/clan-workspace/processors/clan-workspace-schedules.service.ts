import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { CLAN_WORKSPACE_SCHEDULES } from '../config';

@Injectable()
export class ClanWorkspaceSchedulesService extends createJobSchedules({
  schedules: CLAN_WORKSPACE_SCHEDULES,
  label: 'clan workspace'
}) {}
