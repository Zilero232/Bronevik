import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { GOAL_PROGRESS_QUEUE } from '../config';
import { GoalProgressService } from '../services';

@Processor(GOAL_PROGRESS_QUEUE.name, { concurrency: 1 })
export class GoalProgressProcessor extends WorkerHost {
  constructor(
    private readonly progress: GoalProgressService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<number> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<number> {
    return match(job.name)
      .with(GOAL_PROGRESS_QUEUE.jobs.progress, () => this.progress.run(new Date()))
      .otherwise(() => 0);
  }
}
