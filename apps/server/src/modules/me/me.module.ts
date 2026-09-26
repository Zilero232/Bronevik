import { Module } from '@nestjs/common';

import { AnalyticsModule } from '../analytics';
import { BillingCoreModule } from '../billing';
import { PlayersModule } from '../players';
import { DataExportController } from './data-export.controller';
import { MeController } from './me.controller';
import { DataExportService, FavoritesService, GoalsService, LinkedAccountsService, MyMarksService, NotificationSettingsService } from './services';

@Module({
  imports: [BillingCoreModule, PlayersModule, AnalyticsModule],
  controllers: [MeController, DataExportController],
  providers: [DataExportService, FavoritesService, GoalsService, NotificationSettingsService, LinkedAccountsService, MyMarksService]
})
export class MeModule {}
