import type { OnApplicationBootstrap, Type } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { getQueueToken } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import type { CreateJobSchedulesInput } from './job-schedules.types';

import { AppConfigService } from '../../config';
import { registerJobSchedules } from '../lib';

export const createJobSchedules = ({ schedules, label }: CreateJobSchedulesInput): Type<OnApplicationBootstrap> => {
  @Injectable()
  class SchedulesService implements OnApplicationBootstrap {
    private readonly logger = new Logger(label);

    constructor(
      private readonly moduleRef: ModuleRef,
      private readonly config: AppConfigService
    ) {}

    async onApplicationBootstrap(): Promise<void> {
      if (this.config.get('NODE_ENV') === 'test') {
        return;
      }

      const registered = await registerJobSchedules({
        schedules,
        queueOf: (name) => this.moduleRef.get<Queue>(getQueueToken(name), { strict: false }),
        environment: {
          hasLesta: this.config.get('LESTA_APPLICATION_ID') !== ''
        }
      });

      this.logger.log(`registered ${registered} of ${schedules.length} ${label} job schedulers`);
    }
  }

  return SchedulesService;
};
