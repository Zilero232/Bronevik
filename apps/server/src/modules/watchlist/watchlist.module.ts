import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { WatchlistActivityService, WatchlistService } from './services';
import { WatchlistController } from './watchlist.controller';

@Module({
  imports: [BillingCoreModule],
  controllers: [WatchlistController],
  providers: [WatchlistActivityService, WatchlistService]
})
export class WatchlistModule {}
