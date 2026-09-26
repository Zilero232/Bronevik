import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { WebhooksProcessor } from './processors/webhooks.processor';
import {
  ApiTierService,
  ApiTierSyncService,
  HostLookupService,
  SessionCloseService,
  WebhookDeliveryService,
  WebhookEndpointsService
} from './services';

@Module({
  imports: [BillingCoreModule],
  providers: [
    HostLookupService,
    ApiTierService,
    WebhookEndpointsService,
    ApiTierSyncService,
    WebhookDeliveryService,
    SessionCloseService,
    WebhooksProcessor
  ]
})
export class DeveloperWorkerModule {}
