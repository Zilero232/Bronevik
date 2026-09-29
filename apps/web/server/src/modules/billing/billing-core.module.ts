import { Module } from '@nestjs/common';

import { HttpModule } from '../../core';
import { PlusGuard } from './guards';
import { yooKassaProvider } from './providers';
import { EntitlementsBusService, EntitlementsService, PromoService, ReferralService, SubscriptionService, WebhookService } from './services';

@Module({
  imports: [HttpModule],
  providers: [
    yooKassaProvider,
    EntitlementsBusService,
    SubscriptionService,
    EntitlementsService,
    PromoService,
    ReferralService,
    WebhookService,
    PlusGuard
  ],
  exports: [
    yooKassaProvider,
    EntitlementsBusService,
    SubscriptionService,
    EntitlementsService,
    PromoService,
    ReferralService,
    WebhookService,
    PlusGuard
  ]
})
export class BillingCoreModule {}
