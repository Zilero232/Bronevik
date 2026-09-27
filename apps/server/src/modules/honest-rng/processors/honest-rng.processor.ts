import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { HONEST_RNG_QUEUE } from '../config';
import { RngAggregateService } from '../services';

@Processor(HONEST_RNG_QUEUE.name, { concurrency: 1 })
export class HonestRngProcessor extends WorkerHost {
  constructor(
    private readonly aggregates: RngAggregateService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(HONEST_RNG_QUEUE.jobs.aggregate, () => this.aggregates.compute())
      .otherwise(() => null);
  }
}
