import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService, TrackedWorkerHost } from '../../collector/metrics';
import { PROGRESSION_QUEUE } from '../config';
import { ProgressionRunService } from '../services';

@Processor(PROGRESSION_QUEUE.name, { concurrency: 1 })
export class ProgressionProcessor extends TrackedWorkerHost {
  constructor(
    private readonly runs: ProgressionRunService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(PROGRESSION_QUEUE.jobs.run, () => this.runs.run(new Date()))
      .otherwise(() => null);
  }
}
