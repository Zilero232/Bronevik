import { Module } from '@nestjs/common';

import { BillingCoreModule } from './billing-core.module';
import { BillingController } from './billing.controller';
import { WebhookIpGuard } from './guards';
import { CheckoutService, TrialService } from './services';

@Module({
  imports: [BillingCoreModule],
  controllers: [BillingController],
  providers: [CheckoutService, TrialService, WebhookIpGuard],
  exports: [BillingCoreModule]
})
export class BillingModule {}
