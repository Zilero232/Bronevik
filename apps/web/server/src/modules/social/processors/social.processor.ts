import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService, TrackedWorkerHost } from '../../collector/metrics';
import { SOCIAL_QUEUE } from '../config';
import { LeagueDivisionService, WeeklyChallengeService } from '../services';

@Processor(SOCIAL_QUEUE.name, { concurrency: 1 })
export class SocialProcessor extends TrackedWorkerHost {
  constructor(
    private readonly challenges: WeeklyChallengeService,
    private readonly leagues: LeagueDivisionService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(SOCIAL_QUEUE.jobs.challenges, () => this.challenges.evaluate(new Date()))
      .with(SOCIAL_QUEUE.jobs.leagues, () => this.leagues.rollover(new Date()))
      .otherwise(() => null);
  }
}
