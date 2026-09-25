import { Injectable } from '@nestjs/common';

import { JobSchedulesService } from '../../../common/schedules';
import { SHOP_QUEUE, SHOP_SCHEDULES } from '../config';

@Injectable()
export class ShopSchedulesService extends JobSchedulesService({ queue: SHOP_QUEUE.name, schedules: SHOP_SCHEDULES, label: 'shop' }) {}
