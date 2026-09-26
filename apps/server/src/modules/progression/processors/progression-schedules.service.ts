import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { PROGRESSION_QUEUE, PROGRESSION_SCHEDULES } from '../config';

@Injectable()
export class ProgressionSchedulesService extends createJobSchedules({
  queue: PROGRESSION_QUEUE.name,
  schedules: PROGRESSION_SCHEDULES,
  label: 'progression'
}) {}
