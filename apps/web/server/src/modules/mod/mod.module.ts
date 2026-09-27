import { Module } from '@nestjs/common';

import { ModRatingsController } from './mod-ratings.controller';
import { ModController } from './mod.controller';
import { EventLedgerService, ModBindService, ModDeviceService, ModIngestService, ModRatingsService } from './services';

@Module({
  controllers: [ModController, ModRatingsController],
  providers: [EventLedgerService, ModBindService, ModDeviceService, ModIngestService, ModRatingsService],
  exports: [ModDeviceService]
})
export class ModModule {}
