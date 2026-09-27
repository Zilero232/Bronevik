import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { SOCIAL_QUEUE } from '../config';
import { LeagueDivisionService, WeeklyChallengeService } from '../services';

@Processor(SOCIAL_QUEUE.name, { concurrency: 1 })
export class SocialProcessor extends WorkerHost {
  constructor(
    private readonly challenges: WeeklyChallengeService,
    private readonly leagues: LeagueDivisionService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return match(job.name)
      .with(SOCIAL_QUEUE.jobs.challenges, () => this.challenges.evaluate(new Date()))
      .with(SOCIAL_QUEUE.jobs.leagues, () => this.leagues.rollover(new Date()))
      .otherwise(() => null);
  }
}
