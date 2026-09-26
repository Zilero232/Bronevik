import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { HONEST_RNG_QUEUE, HONEST_RNG_SCHEDULES } from '../config';

@Injectable()
export class HonestRngSchedulesService extends createJobSchedules({
  queue: HONEST_RNG_QUEUE.name,
  schedules: HONEST_RNG_SCHEDULES,
  label: 'honest-rng'
}) {}
