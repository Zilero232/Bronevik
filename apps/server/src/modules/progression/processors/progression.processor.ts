import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { PROGRESSION_QUEUE } from '../config';
import { ProgressionRunService } from '../services';

@Processor(PROGRESSION_QUEUE.name, { concurrency: 1 })
export class ProgressionProcessor extends WorkerHost {
  constructor(
    private readonly runs: ProgressionRunService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(PROGRESSION_QUEUE.jobs.run, () => this.runs.run(new Date()))
      .otherwise(() => null);
  }
}
