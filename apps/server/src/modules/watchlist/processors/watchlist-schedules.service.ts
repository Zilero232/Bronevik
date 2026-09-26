import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { WATCHLIST_QUEUE, WATCHLIST_SCHEDULES } from '../config';

@Injectable()
export class WatchlistSchedulesService extends createJobSchedules({
  queue: WATCHLIST_QUEUE.name,
  schedules: WATCHLIST_SCHEDULES,
  label: 'watchlist'
}) {}
