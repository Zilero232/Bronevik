import { Injectable } from '@nestjs/common';

import { JobSchedulesService } from '../../../common/schedules';
import { PULSE_QUEUE, PULSE_SCHEDULES } from '../config';

@Injectable()
export class PulseSchedulesService extends JobSchedulesService({ queue: PULSE_QUEUE.name, schedules: PULSE_SCHEDULES, label: 'pulse' }) {}
