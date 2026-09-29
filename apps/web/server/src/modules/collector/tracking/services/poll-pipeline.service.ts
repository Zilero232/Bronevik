import { Injectable, Logger } from '@nestjs/common';

import type { PollResult, RunPipelineInput } from '../tracking.types';

import { errorMessage } from '../../../../common/lib';
import { runPollPipeline } from '../lib/poll-pipeline';
import { RatingsTriggerService } from './ratings-trigger.service';
import { TrackingLestaService } from './tracking-lesta.service';
import { TrackingStoreService } from './tracking-store.service';

@Injectable()
export class PollPipelineService {
  private readonly logger = new Logger(PollPipelineService.name);

  constructor(
    private readonly lesta: TrackingLestaService,
    private readonly store: TrackingStoreService,
    private readonly ratings: RatingsTriggerService
  ) {}

  async run({ accountIds, lane, tier, promote = false }: RunPipelineInput): Promise<PollResult> {
    const result = await runPollPipeline({
      ports: {
        lesta: this.lesta.port(lane),
        store: this.store,
        onError: ({ accountId, error }) => this.logger.warn(`account ${accountId} failed: ${errorMessage(error)}`)
      },
      accountIds,
      tier,
      promote
    });

    await this.ratings.request(result.updated);

    if (result.failed.length > 0 && result.updated.length + result.unchanged.length === 0) {
      throw new Error(`every account in the batch failed (${result.failed.length})`);
    }

    return result;
  }
}
