import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { SOCIAL_QUEUE } from '../config';
import { LeagueDivisionService, WeeklyChallengeService } from '../services';

@Processor(SOCIAL_QUEUE.name, { concurrency: 1 })
export class SocialProcessor extends WorkerHost {
  constructor(
    private readonly challenges: WeeklyChallengeService,
    private readonly leagues: LeagueDivisionService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(SOCIAL_QUEUE.jobs.challenges, () => this.challenges.evaluate(new Date()))
      .with(SOCIAL_QUEUE.jobs.leagues, () => this.leagues.rollover(new Date()))
      .otherwise(() => null);
  }
}
