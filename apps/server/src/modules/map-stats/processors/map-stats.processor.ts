import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MAP_STATS_QUEUE } from '../config';
import { MapStatsAggregateService } from '../services';

@Processor(MAP_STATS_QUEUE.name, { concurrency: 1 })
export class MapStatsProcessor extends WorkerHost {
  constructor(private readonly aggregates: MapStatsAggregateService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return match(job.name)
      .with(MAP_STATS_QUEUE.jobs.aggregate, () => this.aggregates.compute())
      .otherwise(() => null);
  }
}
