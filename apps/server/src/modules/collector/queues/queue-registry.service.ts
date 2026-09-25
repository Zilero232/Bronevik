import type { Queue } from 'bullmq';

import { getQueueToken } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { QUEUE } from '../contracts';

@Injectable()
export class QueueRegistryService {
  constructor(private readonly moduleRef: ModuleRef) {}

  all(): Queue[] {
    return Object.values(QUEUE).map((name) => this.moduleRef.get<Queue>(getQueueToken(name), { strict: false }));
  }
}
