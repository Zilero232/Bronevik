import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { HONEST_RNG_QUEUE } from '../config';
import { RngAggregateService } from '../services';

@Processor(HONEST_RNG_QUEUE.name, { concurrency: 1 })
export class HonestRngProcessor extends WorkerHost {
  constructor(private readonly aggregates: RngAggregateService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return match(job.name)
      .with(HONEST_RNG_QUEUE.jobs.aggregate, () => this.aggregates.compute())
      .otherwise(() => null);
  }
}
