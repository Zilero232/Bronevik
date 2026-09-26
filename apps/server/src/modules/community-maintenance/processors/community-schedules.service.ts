import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { COMMUNITY_QUEUE, COMMUNITY_SCHEDULES } from '../config';

@Injectable()
export class CommunitySchedulesService extends createJobSchedules({
  queue: COMMUNITY_QUEUE.name,
  schedules: COMMUNITY_SCHEDULES,
  label: 'community'
}) {}
