import type { OnApplicationBootstrap } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { JOB_SCHEDULES, registerJobSchedules } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { BILLING_QUEUE, BILLING_SCHEDULES } from '../config';

@Injectable()
export class BillingSchedulesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BillingSchedulesService.name);

  constructor(
    private readonly config: AppConfigService,
    @InjectQueue(BILLING_QUEUE.name) private readonly queue: Queue
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get('NODE_ENV') === 'test') {
      return;
    }

    const registered = await registerJobSchedules({ schedules: BILLING_SCHEDULES, queueOf: () => this.queue, timezone: JOB_SCHEDULES.timezone });

    this.logger.log(`registered ${registered} billing job schedulers`);
  }
}
