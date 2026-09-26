import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { ModesController } from './modes.controller';
import { ModeMetaQueryService, MyModeStatsService } from './services';

@Module({
  imports: [BillingCoreModule],
  controllers: [ModesController],
  providers: [ModeMetaQueryService, MyModeStatsService]
})
export class ModesModule {}
