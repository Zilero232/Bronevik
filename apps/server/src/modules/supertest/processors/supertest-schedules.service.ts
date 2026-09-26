import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { SUPERTEST_QUEUE, SUPERTEST_SCHEDULES } from '../config';

@Injectable()
export class SupertestSchedulesService extends createJobSchedules({
  queue: SUPERTEST_QUEUE.name,
  schedules: SUPERTEST_SCHEDULES,
  label: 'supertest'
}) {}
