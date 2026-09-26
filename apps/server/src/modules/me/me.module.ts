import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { PlayersModule } from '../players';
import { MeController } from './me.controller';
import { FavoritesService, GoalsService, LinkedAccountsService, MyMarksService, NotificationSettingsService } from './services';

@Module({
  imports: [BillingCoreModule, PlayersModule],
  controllers: [MeController],
  providers: [FavoritesService, GoalsService, NotificationSettingsService, LinkedAccountsService, MyMarksService]
})
export class MeModule {}
