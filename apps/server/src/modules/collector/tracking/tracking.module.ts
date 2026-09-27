import { Module } from '@nestjs/common';

import { ReferenceCoreModule } from '../../reference';
import { PurgeModule } from '../purge';
import { EnrolProcessor } from './processors/enrol.processor';
import { PollProcessor } from './processors/poll.processor';
import { SweepProcessor } from './processors/sweep.processor';
import {
  DispatchService,
  EnrolService,
  PollPipelineService,
  RatingsTriggerService,
  SeedService,
  TrackingAnnounceService,
  TrackingLestaService,
  TrackingStoreService
} from './services';

@Module({
  imports: [PurgeModule, ReferenceCoreModule],
  providers: [
    TrackingLestaService,
    TrackingAnnounceService,
    TrackingStoreService,
    RatingsTriggerService,
    PollPipelineService,
    DispatchService,
    SeedService,
    EnrolService,
    EnrolProcessor,
    PollProcessor,
    SweepProcessor
  ]
})
export class TrackingModule {}
