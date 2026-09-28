import { Module } from '@nestjs/common';

import { AnalyticsModule } from '../analytics';
import { BillingCoreModule } from '../billing';
import { ModModule } from '../mod';
import { PlayersModule } from '../players';
import { DataExportController } from './data-export.controller';
import { MeController } from './me.controller';
import { ModGoalsController } from './mod-goals.controller';
import { DataExportService, FavoritesService, GoalsService, LinkedAccountsService, MyMarksService, NotificationSettingsService } from './services';

@Module({
  imports: [BillingCoreModule, PlayersModule, AnalyticsModule, ModModule],
  controllers: [MeController, DataExportController, ModGoalsController],
  providers: [DataExportService, FavoritesService, GoalsService, NotificationSettingsService, LinkedAccountsService, MyMarksService]
})
export class MeModule {}
