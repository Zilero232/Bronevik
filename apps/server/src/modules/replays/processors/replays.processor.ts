import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';
import { z } from 'zod';

import { REPLAYS_QUEUE } from '../config';
import { BestOfWeekService, ReplayParseService } from '../services';

const parseJobSchema = z.object({ replayId: z.uuid() });

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
      .with(REPLAYS_QUEUE.jobs.parse, () => this.parser.parse(parseJobSchema.parse(job.data).replayId))
      .with(REPLAYS_QUEUE.jobs.bestOfWeek, () => this.bestOfWeek.feature(new Date()))
      .otherwise(() => null);
  }
}
