import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { SHOP_QUEUE, SHOP_SCHEDULES } from '../config';

@Injectable()
export class ShopSchedulesService extends createJobSchedules({ queue: SHOP_QUEUE.name, schedules: SHOP_SCHEDULES, label: 'shop' }) {}
