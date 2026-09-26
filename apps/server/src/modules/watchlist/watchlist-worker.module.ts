import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { NotificationsProducerModule } from '../notifications';
import { WATCHLIST_QUEUE } from './config';
import { WatchlistProcessor, WatchlistSchedulesService } from './processors';
import { WatchlistActivityService, WatchlistDigestService } from './services';

@Module({
  imports: [BillingCoreModule, NotificationsProducerModule, BullModule.registerQueue({ name: WATCHLIST_QUEUE.name })],
  providers: [WatchlistActivityService, WatchlistDigestService, WatchlistProcessor, WatchlistSchedulesService]
})
export class WatchlistWorkerModule {}
