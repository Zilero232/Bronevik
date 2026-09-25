import { Injectable } from '@nestjs/common';

import { JobSchedulesService } from '../../../common/schedules';
import { REPLAYS_QUEUE, REPLAYS_SCHEDULES } from '../config';

@Injectable()
export class ReplaysSchedulesService extends JobSchedulesService({ queue: REPLAYS_QUEUE.name, schedules: REPLAYS_SCHEDULES, label: 'replays' }) {}
