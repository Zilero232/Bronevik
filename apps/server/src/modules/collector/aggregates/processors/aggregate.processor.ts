import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { WORKER_CONCURRENCY } from '../../config';
import { accountRatingsPayloadSchema, JOB, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { AccountRatingsService, ServerStatsService, TankPercentilesService, TierMaintenanceService } from '../services';

@Processor(QUEUE.aggregate, { concurrency: WORKER_CONCURRENCY.aggregate })
export class AggregateProcessor extends WorkerHost {
  constructor(
    private readonly accountRatings: AccountRatingsService,
    private readonly serverStats: ServerStatsService,
    private readonly percentiles: TankPercentilesService,
    private readonly maintenance: TierMaintenanceService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({
      job,
      run: () =>
        match<string, Promise<unknown>>(job.name)
          .with(JOB.aggregate.accountRatings, () => this.accountRatings.compute(accountRatingsPayloadSchema.parse(job.data)))
          .with(JOB.aggregate.serverStats, () => this.serverStats.compute())
          .with(JOB.aggregate.tankPercentiles, () => this.percentiles.compute())
          .with(JOB.aggregate.tierMaintenance, () => this.maintenance.run())
          .otherwise(async () => ({ ignored: job.name }))
    });
  }
}
