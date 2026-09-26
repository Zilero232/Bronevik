import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { ACHIEVEMENTS_RARITY_QUEUE, ACHIEVEMENTS_RARITY_SCHEDULES } from '../config';

@Injectable()
export class AchievementsRaritySchedulesService extends createJobSchedules({
  queue: ACHIEVEMENTS_RARITY_QUEUE.name,
  schedules: ACHIEVEMENTS_RARITY_SCHEDULES,
  label: 'achievements-rarity'
}) {}
