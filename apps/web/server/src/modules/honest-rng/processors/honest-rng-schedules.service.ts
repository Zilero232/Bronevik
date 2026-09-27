import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { HONEST_RNG_SCHEDULES } from '../config';

@Injectable()
export class HonestRngSchedulesService extends createJobSchedules({
  schedules: HONEST_RNG_SCHEDULES,
  label: 'honest-rng'
}) {}
