import type { OnApplicationBootstrap } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppConfigService } from '../../../config';
import { JOB_SCHEDULES, registerJobSchedules } from '../../notifications';
import { STREAMERS_QUEUE, STREAMERS_SCHEDULES } from '../config';

@Injectable()
export class StreamersSchedulesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StreamersSchedulesService.name);

  constructor(
    private readonly config: AppConfigService,
    @InjectQueue(STREAMERS_QUEUE.name) private readonly queue: Queue
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get('NODE_ENV') === 'test') {
      return;
    }

    const registered = await registerJobSchedules({ schedules: STREAMERS_SCHEDULES, queueOf: () => this.queue, timezone: JOB_SCHEDULES.timezone });

    this.logger.log(`registered ${registered} streamer job schedulers`);
  }
}
