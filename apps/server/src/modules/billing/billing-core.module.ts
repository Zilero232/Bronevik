import { Module } from '@nestjs/common';

import { PlusGuard } from './guards';
import { yooKassaProvider } from './providers';
import { EntitlementsBusService, EntitlementsService, PromoService, ReferralService, SubscriptionService, WebhookService } from './services';

@Module({
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
