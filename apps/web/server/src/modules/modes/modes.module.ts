import { Module } from '@nestjs/common';

import { UserLestaAccountsModule } from '../../core';
import { BillingCoreModule } from '../billing';
import { PlayersModule } from '../players';
import { ModesController } from './modes.controller';
import { ModeMetaQueryService, MyModeStatsService } from './services';

@Module({
  imports: [UserLestaAccountsModule, BillingCoreModule, PlayersModule],
  controllers: [ModesController],
  providers: [ModeMetaQueryService, MyModeStatsService]
})
export class ModesModule {}
