import { AppConfigService } from '../../../config';
import { YooKassaClient } from '../lib';

export const yooKassaProvider = {
  provide: YooKassaClient,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) =>
    new YooKassaClient({ shopId: config.get('YOOKASSA_SHOP_ID'), secretKey: config.get('YOOKASSA_SECRET_KEY') })
};
