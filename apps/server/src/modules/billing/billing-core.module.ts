import { Module } from '@nestjs/common';

import { AppConfigService } from '../../config';
import { YooKassaClient } from './lib';
import { EntitlementsService, PromoService, ReferralService, SubscriptionService, WebhookService } from './services';

const yooKassaProvider = {
  provide: YooKassaClient,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) =>
    new YooKassaClient({ shopId: config.get('YOOKASSA_SHOP_ID'), secretKey: config.get('YOOKASSA_SECRET_KEY') })
};

@Module({
  providers: [yooKassaProvider, SubscriptionService, EntitlementsService, PromoService, ReferralService, WebhookService],
  exports: [yooKassaProvider, SubscriptionService, EntitlementsService, PromoService, ReferralService, WebhookService]
})
export class BillingCoreModule {}
