import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { WORKER_CONCURRENCY } from '../../config';
import { accountRatingsPayloadSchema, JOB, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import {
  AccountRatingsService,
  BuildUsageService,
  LearningCurveService,
  ModeMetaService,
  ServerStatsService,
  TankEconomyService,
  TankPercentilesService,
  TierMaintenanceService
} from '../services';

@Processor(QUEUE.aggregate, { concurrency: WORKER_CONCURRENCY.aggregate })
export class AggregateProcessor extends WorkerHost {
  constructor(
    private readonly accountRatings: AccountRatingsService,
    private readonly serverStats: ServerStatsService,
    private readonly percentiles: TankPercentilesService,
    private readonly maintenance: TierMaintenanceService,
    private readonly economy: TankEconomyService,
    private readonly learning: LearningCurveService,
    private readonly buildUsage: BuildUsageService,
    private readonly modeMeta: ModeMetaService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job) {
    return match<string, Promise<unknown>>(job.name)
      .with(JOB.aggregate.accountRatings, () => this.accountRatings.compute(accountRatingsPayloadSchema.parse(job.data)))
      .with(JOB.aggregate.serverStats, () => this.serverStats.compute())
      .with(JOB.aggregate.tankPercentiles, () => this.percentiles.compute())
      .with(JOB.aggregate.tierMaintenance, () => this.maintenance.run())
      .with(JOB.aggregate.tankEconomy, () => this.economy.compute())
      .with(JOB.aggregate.learningCurve, () => this.learning.compute())
      .with(JOB.aggregate.buildUsage, () => this.buildUsage.compute())
      .with(JOB.aggregate.modeMeta, () => this.modeMeta.compute())
      .otherwise(async () => ({ ignored: job.name }));
  }
}
