import { Module } from '@nestjs/common';

import { NotificationsProducerModule } from '../notifications';
import { BonusCodeService, NewsQueryService, OfferQueryService } from './services';
import { ShopController } from './shop.controller';

@Module({
  imports: [NotificationsProducerModule],
  controllers: [ShopController],
  providers: [OfferQueryService, BonusCodeService, NewsQueryService]
})
export class ShopModule {}
