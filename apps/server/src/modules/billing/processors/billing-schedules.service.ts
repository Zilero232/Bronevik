import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { BILLING_SCHEDULES } from '../config';

@Injectable()
export class BillingSchedulesService extends createJobSchedules({ schedules: BILLING_SCHEDULES, label: 'billing' }) {}
