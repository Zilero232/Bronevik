import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService, TrackedWorkerHost } from '../../collector/metrics';
import { BILLING_QUEUE } from '../config';
import { RenewalService } from '../services';

@Processor(BILLING_QUEUE.name, { concurrency: 1 })
export class BillingProcessor extends TrackedWorkerHost<number> {
  constructor(
    private readonly renewals: RenewalService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job): Promise<number> {
    return match(job.name)
      .with(BILLING_QUEUE.jobs.renew, () => this.renewals.chargeDue())
      .with(BILLING_QUEUE.jobs.expire, () => this.renewals.expireDue())
      .otherwise(() => 0);
  }
}
