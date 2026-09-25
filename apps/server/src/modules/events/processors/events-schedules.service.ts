import { Injectable } from '@nestjs/common';

import { JobSchedulesService } from '../../../common/schedules';
import { EVENTS_QUEUE, EVENTS_SCHEDULES } from '../config';

@Injectable()
export class EventsSchedulesService extends JobSchedulesService({ queue: EVENTS_QUEUE.name, schedules: EVENTS_SCHEDULES, label: 'events' }) {}
