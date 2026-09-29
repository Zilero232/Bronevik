import type { OnApplicationShutdown } from '@nestjs/common';

import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { startOfMinute } from 'date-fns';

import type { LestaOutcomeRecorder, RecordLestaInput } from '../../../core';
import type { MetricCounters, RecordJobInput, TrackJobInput } from './metrics.types';

import { PrismaService } from '../../../core';
import { COLLECTOR_STATE_KEY } from '../config';
import { CircuitBreakerService } from './circuit-breaker.service';
import { EMPTY_COUNTERS, METRICS } from './config';
import { jobContext } from './job-context';
import { jobSuccessKey } from './lib';

@Injectable()
export class MetricsService implements LestaOutcomeRecorder, OnApplicationShutdown {
  private readonly logger = new Logger(MetricsService.name);
  private counters = new Map<string, MetricCounters>();
  private succeeded = new Map<string, string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly breaker: CircuitBreakerService
  ) {}

  async track<T>({ job, run }: TrackJobInput<T>): Promise<T> {
    const queue = job.queueName;
    const retried = job.attemptsMade > 0;
    const startedAt = performance.now();

    try {
      const result = await jobContext.run({ queue }, run);

      this.recordJob({ queue, durationMs: performance.now() - startedAt, ok: true, retried });
      this.succeeded.set(jobSuccessKey({ queue, name: job.name }), new Date().toISOString());

      return result;
    } catch (error) {
      this.recordJob({ queue, durationMs: performance.now() - startedAt, ok: false, retried });

      throw error;
    }
  }

  recordLesta({ outcome }: RecordLestaInput) {
    const counters = this.countersFor(jobContext.getStore()?.queue ?? METRICS.unscopedQueue);

    counters.lestaRequests += 1;
    counters.lestaErrors += outcome === 'ok' ? 0 : 1;

    if (outcome !== 'rejected') {
      this.breaker.record(outcome === 'ok');
    }
  }

  @Interval(METRICS.flushIntervalMs)
  async flush() {
    const pending = this.counters;

    this.counters = new Map();

    const bucketStart = startOfMinute(new Date());

    for (const [queue, counters] of pending) {
      const durationMsTotal = BigInt(Math.round(counters.durationMs));

      try {
        await this.prisma.collectorJobMetric.upsert({
          where: { queue_bucketStart: { queue, bucketStart } },
          create: {
            queue,
            bucketStart,
            processed: counters.processed,
            failed: counters.failed,
            retried: counters.retried,
            durationMsTotal,
            lestaRequests: counters.lestaRequests,
            lestaErrors: counters.lestaErrors
          },
          update: {
            processed: { increment: counters.processed },
            failed: { increment: counters.failed },
            retried: { increment: counters.retried },
            durationMsTotal: { increment: durationMsTotal },
            lestaRequests: { increment: counters.lestaRequests },
            lestaErrors: { increment: counters.lestaErrors }
          }
        });
      } catch (error) {
        this.logger.warn(`metrics flush for ${queue} failed: ${String(error)}`);
      }
    }

    await this.flushSuccesses();
  }

  async onApplicationShutdown() {
    await this.flush();
  }

  private async flushSuccesses() {
    if (this.succeeded.size === 0) {
      return;
    }

    const value = JSON.stringify(Object.fromEntries(this.succeeded));

    this.succeeded = new Map();

    try {
      await this.prisma.$executeRaw`
        INSERT INTO collector_state (key, value, updated_at)
        VALUES (${COLLECTOR_STATE_KEY.jobSuccess}, ${value}::jsonb, now())
        ON CONFLICT (key) DO UPDATE SET value = collector_state.value || EXCLUDED.value, updated_at = now()
      `;
    } catch (error) {
      this.logger.warn(`job success flush failed: ${String(error)}`);
    }
  }

  private recordJob({ queue, durationMs, ok, retried }: RecordJobInput) {
    const counters = this.countersFor(queue);

    counters.processed += ok ? 1 : 0;
    counters.failed += ok ? 0 : 1;
    counters.retried += retried ? 1 : 0;
    counters.durationMs += durationMs;
  }

  private countersFor(queue: string): MetricCounters {
    const existing = this.counters.get(queue);

    if (existing) {
      return existing;
    }

    const created = { ...EMPTY_COUNTERS };

    this.counters.set(queue, created);

    return created;
  }
}
