import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { SOCIAL_QUEUE, SOCIAL_SCHEDULES } from '../config';

@Injectable()
export class SocialSchedulesService extends createJobSchedules({ queue: SOCIAL_QUEUE.name, schedules: SOCIAL_SCHEDULES, label: 'social' }) {}
