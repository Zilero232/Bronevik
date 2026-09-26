import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { COMPETITION_QUEUE, COMPETITION_SCHEDULES } from '../config';

@Injectable()
export class CompetitionsSchedulesService extends createJobSchedules({
  queue: COMPETITION_QUEUE.name,
  schedules: COMPETITION_SCHEDULES,
  label: 'competitions'
}) {}
