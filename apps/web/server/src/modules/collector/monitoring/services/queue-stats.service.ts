import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { differenceInSeconds, startOfMinute } from 'date-fns';

import { AppConfigService, LESTA } from '../../../../config';
import { bulkRequestsPerSecond, PrismaService } from '../../../../core';
import { COLLECTOR_STATE_KEY } from '../../config';
import { CircuitBreakerService } from '../../metrics';
import { QueueRegistryService } from '../../queues';
import { MONITORING } from '../config';

@Injectable()
export class QueueStatsService {
  private readonly logger = new Logger(QueueStatsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: QueueRegistryService,
    private readonly breaker: CircuitBreakerService,
    private readonly config: AppConfigService
  ) {}

  @Interval(MONITORING.queueStatsIntervalMs)
  async collect() {
    try {
      await this.write();
    } catch (error) {
      this.logger.warn(`queue stats failed: ${String(error)}`);
    }
  }

  private async write() {
    const now = new Date();
    const bucketStart = startOfMinute(now);
    const queues: Record<string, Record<string, number>> = {};

    for (const queue of this.registry.all()) {
      const counts = await queue.getJobCounts(...MONITORING.countedStates);
      const [oldest] = await queue.getJobs([...MONITORING.waitingStates], 0, 0, true);
      const lagSeconds = oldest ? Math.max(0, differenceInSeconds(now, oldest.timestamp, { roundingMethod: 'round' })) : 0;
      const queueDepth = (counts.waiting ?? 0) + (counts.prioritized ?? 0) + (counts.delayed ?? 0);

      queues[queue.name] = { ...counts, lagSeconds };

      await this.prisma.collectorJobMetric.upsert({
        where: { queue_bucketStart: { queue: queue.name, bucketStart } },
        create: { queue: queue.name, bucketStart, lagSeconds, queueDepth },
        update: { lagSeconds, queueDepth }
      });
    }

    const requestsPerSecond = this.config.get('LESTA_RPS');

    const budget = {
      requestsPerSecond,
      reserve: LESTA.tierAReserve,
      bulkRequestsPerSecond: bulkRequestsPerSecond({ requestsPerSecond, reserve: LESTA.tierAReserve }),
      circuitOpen: this.breaker.isOpen()
    };

    const snapshot = { collectedAt: now.toISOString(), queues };

    await this.prisma.$transaction([
      this.prisma.collectorState.upsert({
        where: { key: COLLECTOR_STATE_KEY.queues },
        create: { key: COLLECTOR_STATE_KEY.queues, value: snapshot },
        update: { value: snapshot }
      }),
      this.prisma.collectorState.upsert({
        where: { key: COLLECTOR_STATE_KEY.lestaBudget },
        create: { key: COLLECTOR_STATE_KEY.lestaBudget, value: budget },
        update: { value: budget }
      })
    ]);
  }
}
