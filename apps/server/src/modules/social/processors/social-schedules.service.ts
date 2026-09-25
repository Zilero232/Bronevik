import { Injectable } from '@nestjs/common';

import { JobSchedulesService } from '../../../common/schedules';
import { SOCIAL_QUEUE, SOCIAL_SCHEDULES } from '../config';

@Injectable()
export class SocialSchedulesService extends JobSchedulesService({ queue: SOCIAL_QUEUE.name, schedules: SOCIAL_SCHEDULES, label: 'social' }) {}
