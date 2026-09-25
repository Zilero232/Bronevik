import type { OnApplicationBootstrap } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { getQueueToken } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { AppConfigService } from '../../../config';
import { NOTIFICATION_SCHEDULES } from '../config';
import { JOB_SCHEDULES, registerJobSchedules } from '../lib';

@Injectable()
export class NotificationSchedulesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(NotificationSchedulesService.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly config: AppConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get('NODE_ENV') === 'test') {
      return;
    }

    const registered = await registerJobSchedules({
      schedules: NOTIFICATION_SCHEDULES,
      queueOf: (name) => this.moduleRef.get<Queue>(getQueueToken(name), { strict: false }),
      timezone: JOB_SCHEDULES.timezone
    });

    this.logger.log(`registered ${registered} notification job schedulers`);
  }
}
