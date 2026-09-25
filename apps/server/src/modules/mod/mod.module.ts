import { Module } from '@nestjs/common';

import { ModController } from './mod.controller';
import { EventLedgerService, ModBindService, ModDeviceService, ModIngestService } from './services';

@Module({
  controllers: [ModController],
  providers: [EventLedgerService, ModBindService, ModDeviceService, ModIngestService],
  exports: [ModDeviceService]
})
export class ModModule {}
