import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { AchievementsRarityController } from './achievements-rarity.controller';
import { AchievementCatalogService, CollectorsService, TankRarityService } from './services';

@Module({
  imports: [BillingCoreModule],
  controllers: [AchievementsRarityController],
  providers: [AchievementCatalogService, TankRarityService, CollectorsService]
})
export class AchievementsRarityModule {}
