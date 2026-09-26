import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { REPLAYS_QUEUE } from '../config';
import { replayParseJobSchema } from '../dto';
import { BestOfWeekService, ReplayParseService } from '../services';

@Processor(REPLAYS_QUEUE.name, { concurrency: REPLAYS_QUEUE.concurrency })
export class ReplaysProcessor extends WorkerHost {
  constructor(
    private readonly parser: ReplayParseService,
    private readonly bestOfWeek: BestOfWeekService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return match(job.name)
      .with(REPLAYS_QUEUE.jobs.parse, () =>
        this.parser.parse({
          replayId: replayParseJobSchema.parse(job.data).replayId,
          isFinalAttempt: job.attemptsMade + 1 >= (job.opts.attempts ?? 1)
        })
      )
      .with(REPLAYS_QUEUE.jobs.bestOfWeek, () => this.bestOfWeek.feature(new Date()))
      .otherwise(() => null);
  }
}
