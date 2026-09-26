import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { COMPETITION_QUEUE } from '../config';
import { CompetitionScoringService } from '../services';

@Processor(COMPETITION_QUEUE.name, { concurrency: 1 })
export class CompetitionsProcessor extends WorkerHost {
  constructor(private readonly scoring: CompetitionScoringService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return match(job.name)
      .with(COMPETITION_QUEUE.jobs.score, () => this.scoring.run(new Date()))
      .otherwise(() => null);
  }
}
