import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { REPLAYS_QUEUE, REPLAYS_SCHEDULES } from '../config';

@Injectable()
export class ReplaysSchedulesService extends createJobSchedules({ queue: REPLAYS_QUEUE.name, schedules: REPLAYS_SCHEDULES, label: 'replays' }) {}
