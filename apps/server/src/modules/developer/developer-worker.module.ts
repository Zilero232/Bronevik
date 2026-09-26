import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { WebhooksProcessor } from './processors/webhooks.processor';
import {
  ApiTierService,
  ApiTierSyncService,
  HostLookupService,
  SessionCloseService,
  WebhookDeliveryService,
  WebhookEndpointsService,
  WebhookPosterService
} from './services';

@Module({
  imports: [BillingCoreModule],
  providers: [
    HostLookupService,
    WebhookPosterService,
    ApiTierService,
    WebhookEndpointsService,
    ApiTierSyncService,
    WebhookDeliveryService,
    SessionCloseService,
    WebhooksProcessor
  ]
})
export class DeveloperWorkerModule {}
