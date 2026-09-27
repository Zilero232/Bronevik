import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { BILLING_QUEUE } from '../config';
import { RenewalService } from '../services';

@Processor(BILLING_QUEUE.name, { concurrency: 1 })
export class BillingProcessor extends WorkerHost {
  constructor(
    private readonly renewals: RenewalService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<number> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<number> {
    return match(job.name)
      .with(BILLING_QUEUE.jobs.renew, () => this.renewals.chargeDue())
      .with(BILLING_QUEUE.jobs.expire, () => this.renewals.expireDue())
      .otherwise(() => 0);
  }
}
