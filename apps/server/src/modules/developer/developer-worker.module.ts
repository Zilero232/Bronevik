import { Module } from '@nestjs/common';

import { WebhooksProcessor } from './processors/webhooks.processor';
import { SessionCloseService, WebhookDeliveryService } from './services';

@Module({
  providers: [WebhookDeliveryService, SessionCloseService, WebhooksProcessor]
})
export class DeveloperWorkerModule {}
