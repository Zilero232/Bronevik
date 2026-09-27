import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { WORKER_CONCURRENCY } from '../../config';
import { encyclopediaPayloadSchema, JOB, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { EncyclopediaSyncService, ExpectedValuesSyncService, MasteryThresholdsSyncService, MoeThresholdsSyncService } from '../services';

@Processor(QUEUE.reference, { concurrency: WORKER_CONCURRENCY.reference })
export class ReferenceProcessor extends WorkerHost {
  constructor(
    private readonly encyclopedia: EncyclopediaSyncService,
    private readonly expectedValues: ExpectedValuesSyncService,
    private readonly moe: MoeThresholdsSyncService,
    private readonly mastery: MasteryThresholdsSyncService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({
      job,
      run: () =>
        match<string, Promise<unknown>>(job.name)
          .with(JOB.reference.versionCheck, () => this.encyclopedia.checkVersion())
          .with(JOB.reference.encyclopedia, () => this.encyclopedia.sync(encyclopediaPayloadSchema.parse(job.data)))
          .with(JOB.reference.wn8Expected, () => this.expectedValues.sync())
          .with(JOB.reference.moeThresholds, () => this.moe.sync())
          .with(JOB.reference.masteryThresholds, () => this.mastery.sync())
          .otherwise(async () => ({ ignored: job.name }))
    });
  }
}
