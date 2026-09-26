import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { MAP_STATS_QUEUE, MAP_STATS_SCHEDULES } from '../config';

@Injectable()
export class MapStatsSchedulesService extends createJobSchedules({
  queue: MAP_STATS_QUEUE.name,
  schedules: MAP_STATS_SCHEDULES,
  label: 'map-stats'
}) {}
