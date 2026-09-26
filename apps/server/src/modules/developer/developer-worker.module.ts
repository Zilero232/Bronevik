import { Module } from '@nestjs/common';

import { WebhooksProcessor } from './processors/webhooks.processor';
import { HostLookupService, SessionCloseService, WebhookDeliveryService } from './services';

@Module({
  providers: [HostLookupService, WebhookDeliveryService, SessionCloseService, WebhooksProcessor]
})
export class DeveloperWorkerModule {}
