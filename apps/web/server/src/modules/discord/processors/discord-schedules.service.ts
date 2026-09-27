import { Injectable } from '@nestjs/common';

import { createJobSchedules } from '../../../common/schedules';
import { DISCORD_SCHEDULES } from '../config';

@Injectable()
export class DiscordSchedulesService extends createJobSchedules({
  schedules: DISCORD_SCHEDULES,
  label: 'discord'
}) {}
