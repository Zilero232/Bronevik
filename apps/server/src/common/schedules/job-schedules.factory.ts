import type { OnApplicationBootstrap, Type } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import type { CreateJobSchedulesInput } from './job-schedules.types';

import { AppConfigService } from '../../config';
import { JOB_SCHEDULES, registerJobSchedules } from '../../modules/notifications';

export const createJobSchedules = ({ queue, schedules, label }: CreateJobSchedulesInput): Type<OnApplicationBootstrap> => {
  @Injectable()
  class SchedulesService implements OnApplicationBootstrap {
    private readonly logger = new Logger(label);

    constructor(
      private readonly config: AppConfigService,
      @InjectQueue(queue) private readonly target: Queue
    ) {}

    async onApplicationBootstrap(): Promise<void> {
      if (this.config.get('NODE_ENV') === 'test') {
        return;
      }

      const registered = await registerJobSchedules({ schedules, queueOf: () => this.target, timezone: JOB_SCHEDULES.timezone });

      this.logger.log(`registered ${registered} of ${schedules.length} ${label} job schedulers`);
    }
  }

  return SchedulesService;
};
