import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { REPLAYS_QUEUE } from '../config';
import { replayParseJobSchema } from '../dto';
import { BestOfWeekService, ReplayOverflowService, ReplayParseService, ReplayTagBackfillService } from '../services';

@Processor(REPLAYS_QUEUE.name, { concurrency: REPLAYS_QUEUE.concurrency })
export class ReplaysProcessor extends WorkerHost {
  constructor(
    private readonly parser: ReplayParseService,
    private readonly bestOfWeek: BestOfWeekService,
    private readonly overflow: ReplayOverflowService,
    private readonly tagBackfill: ReplayTagBackfillService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(REPLAYS_QUEUE.jobs.parse, () =>
        this.parser.parse({
          replayId: replayParseJobSchema.parse(job.data).replayId,
          isFinalAttempt: job.attemptsMade + 1 >= (job.opts.attempts ?? 1)
        })
      )
      .with(REPLAYS_QUEUE.jobs.bestOfWeek, () => this.bestOfWeek.feature(new Date()))
      .with(REPLAYS_QUEUE.jobs.overflowCleanup, () => this.overflow.run(new Date()))
      .with(REPLAYS_QUEUE.jobs.tagBackfill, () => this.tagBackfill.run())
      .otherwise(() => null);
  }
}
