import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ACHIEVEMENTS_RARITY_QUEUE } from './config';
import { AchievementsRarityProcessor, AchievementsRaritySchedulesService } from './processors';
import { AchievementsFetchService, RarityAggregateService } from './services';

@Module({
  imports: [BullModule.registerQueue({ name: ACHIEVEMENTS_RARITY_QUEUE.name })],
  providers: [AchievementsFetchService, RarityAggregateService, AchievementsRarityProcessor, AchievementsRaritySchedulesService]
})
export class AchievementsRarityWorkerModule {}
