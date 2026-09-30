import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { WORKER_CONCURRENCY } from '../../config';
import { encyclopediaPayloadSchema, JOB, QUEUE } from '../../contracts';
import { MetricsService, TrackedWorkerHost } from '../../metrics';
import {
  CatalogSyncService,
  EncyclopediaSyncService,
  ExpectedValuesSyncService,
  MasteryThresholdsSyncService,
  MoeEstimateSyncService,
  MoeThresholdsSyncService
} from '../services';

@Processor(QUEUE.reference, { concurrency: WORKER_CONCURRENCY.reference })
export class ReferenceProcessor extends TrackedWorkerHost {
  constructor(
    private readonly encyclopedia: EncyclopediaSyncService,
    private readonly expectedValues: ExpectedValuesSyncService,
    private readonly moe: MoeThresholdsSyncService,
    private readonly moeEstimate: MoeEstimateSyncService,
    private readonly mastery: MasteryThresholdsSyncService,
    private readonly catalog: CatalogSyncService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job) {
    return match<string, Promise<unknown>>(job.name)
      .with(JOB.reference.versionCheck, () => this.encyclopedia.checkVersion())
      .with(JOB.reference.encyclopedia, () => this.encyclopedia.sync(encyclopediaPayloadSchema.parse(job.data)))
      .with(JOB.reference.wn8Expected, () => this.expectedValues.sync())
      .with(JOB.reference.moeThresholds, () => this.moe.sync())
      .with(JOB.reference.moeEstimate, () => this.moeEstimate.sync())
      .with(JOB.reference.masteryThresholds, () => this.mastery.sync())
      .with(JOB.reference.englishNames, () => this.catalog.englishNames())
      .otherwise(async () => ({ ignored: job.name }));
  }
}
