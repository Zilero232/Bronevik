import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { SHOP_QUEUE } from './config';
import { ShopProcessor, ShopSchedulesService } from './processors';
import { BonusCodeScrapeService, BonusCodeService, NewsEnrichService, OfferScrapeService } from './services';

@Module({
  imports: [NotificationsProducerModule, BullModule.registerQueue({ name: SHOP_QUEUE.name })],
  providers: [BonusCodeService, OfferScrapeService, BonusCodeScrapeService, NewsEnrichService, ShopProcessor, ShopSchedulesService]
})
export class ShopWorkerModule {}
