import type { OnApplicationBootstrap } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { getQueueToken } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import type { IsScheduleActiveInput } from './schedules.types';

import { AppConfigService, TIME } from '../../../config';
import { SCHEDULES } from './config';

@Injectable()
export class SchedulesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly config: AppConfigService
  ) {}

  async onApplicationBootstrap() {
    if (this.config.get('NODE_ENV') === 'test') {
      this.logger.log('job schedulers are off under NODE_ENV=test');

      return;
    }

    const hasLesta = this.config.get('LESTA_APPLICATION_ID') !== '';
    let registered = 0;

    for (const schedule of SCHEDULES) {
      const queue = this.moduleRef.get<Queue>(getQueueToken(schedule.queue), { strict: false });

      if (!this.isActive({ schedule, hasLesta })) {
        await queue.removeJobScheduler(schedule.id);

        continue;
      }

      const repeat = 'pattern' in schedule.repeat ? { pattern: schedule.repeat.pattern, tz: TIME.zone } : { every: schedule.repeat.every };

      await queue.upsertJobScheduler(schedule.id, repeat, { name: schedule.name, data: schedule.data ?? {} });
      registered += 1;
    }

    this.logger.log(`registered ${registered} of ${SCHEDULES.length} job schedulers`);
  }

  private isActive({ schedule, hasLesta }: IsScheduleActiveInput): boolean {
    return (schedule.enabled ?? true) && (hasLesta || !schedule.needsLesta);
  }
}
