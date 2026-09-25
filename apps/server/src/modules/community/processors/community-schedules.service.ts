import { Injectable } from '@nestjs/common';

import { JobSchedulesService } from '../../../common/schedules';
import { COMMUNITY_QUEUE, COMMUNITY_SCHEDULES } from '../config';

@Injectable()
export class CommunitySchedulesService extends JobSchedulesService({
  queue: COMMUNITY_QUEUE.name,
  schedules: COMMUNITY_SCHEDULES,
  label: 'community'
}) {}
