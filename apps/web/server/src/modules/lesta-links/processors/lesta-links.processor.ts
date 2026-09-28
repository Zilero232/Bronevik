import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { garageDispatchPayloadSchema, garagePayloadSchema, LESTA_LINKS, LESTA_LINKS_QUEUE } from '../config';
import { GarageSyncService, TokenRenewalService } from '../services';

@Processor(LESTA_LINKS_QUEUE.name, { concurrency: LESTA_LINKS.concurrency })
export class LestaLinksProcessor extends WorkerHost {
  constructor(
    private readonly garage: GarageSyncService,
    private readonly tokens: TokenRenewalService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match<string, Promise<unknown>>(job.name)
      .with(LESTA_LINKS_QUEUE.jobs.garageDispatch, () => this.garage.dispatch(garageDispatchPayloadSchema.parse(job.data)))
      .with(LESTA_LINKS_QUEUE.jobs.garage, () => this.garage.sync(garagePayloadSchema.parse(job.data)))
      .with(LESTA_LINKS_QUEUE.jobs.prolongate, () => this.tokens.run())
      .otherwise(async () => ({ ignored: job.name }));
  }
}
