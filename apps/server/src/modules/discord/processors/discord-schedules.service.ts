import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { DISCORD_QUEUE, DISCORD_SCHEDULES } from '../config';

@Injectable()
export class DiscordSchedulesService extends createJobSchedules({
  queue: DISCORD_QUEUE.name,
  schedules: DISCORD_SCHEDULES,
  label: 'discord'
}) {}
