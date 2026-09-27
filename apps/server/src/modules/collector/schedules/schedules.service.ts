import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { SCHEDULES } from './config';

@Injectable()
export class SchedulesService extends createJobSchedules({ schedules: SCHEDULES, label: 'collector' }) {}
