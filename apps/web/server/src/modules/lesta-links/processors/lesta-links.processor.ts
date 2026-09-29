import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService, TrackedWorkerHost } from '../../collector/metrics';
import { garageDispatchPayloadSchema, garagePayloadSchema, LESTA_LINKS, LESTA_LINKS_QUEUE } from '../config';
import { GarageSyncService, TokenRenewalService } from '../services';

@Processor(LESTA_LINKS_QUEUE.name, { concurrency: LESTA_LINKS.concurrency })
export class LestaLinksProcessor extends TrackedWorkerHost {
  constructor(
    private readonly garage: GarageSyncService,
    private readonly tokens: TokenRenewalService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job): Promise<unknown> {
    return match<string, Promise<unknown>>(job.name)
      .with(LESTA_LINKS_QUEUE.jobs.garageDispatch, () => this.garage.dispatch(garageDispatchPayloadSchema.parse(job.data)))
      .with(LESTA_LINKS_QUEUE.jobs.garage, () => this.garage.sync(garagePayloadSchema.parse(job.data)))
      .with(LESTA_LINKS_QUEUE.jobs.prolongate, () => this.tokens.run())
      .otherwise(async () => ({ ignored: job.name }));
  }
}
