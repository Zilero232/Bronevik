import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { OverlaysController } from './overlays.controller';
import {
  ChallengeService,
  IntegrationsService,
  IntegrationStoreService,
  OAuthStateService,
  OverlayDataService,
  OverlayPublisherService,
  OverlayService,
  OverlayStreamService,
  StreamerProfileService
} from './services';
import { StreamersController } from './streamers.controller';

@Module({
  imports: [BillingCoreModule],
  controllers: [OverlaysController, StreamersController],
  providers: [
    StreamerProfileService,
    OverlayService,
    OverlayDataService,
    OverlayPublisherService,
    OverlayStreamService,
    ChallengeService,
    IntegrationStoreService,
    IntegrationsService,
    OAuthStateService
  ]
})
export class StreamersModule {}
