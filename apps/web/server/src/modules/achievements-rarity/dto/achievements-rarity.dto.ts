import { createZodDto } from 'nestjs-zod';

import {
  achievementsCatalogSchema,
  achievementsQuerySchema,
  collectionParamsSchema,
  collectorsQuerySchema,
  collectorsSchema,
  playerCollectionSchema,
  tankRarityQuerySchema,
  tankRaritySchema
} from './achievements-rarity.schemas';

export class AchievementsCatalogDto extends createZodDto(achievementsCatalogSchema) {}

export class AchievementsQueryDto extends createZodDto(achievementsQuerySchema) {}

export class TankRarityDto extends createZodDto(tankRaritySchema) {}

export class TankRarityQueryDto extends createZodDto(tankRarityQuerySchema) {}

export class CollectorsDto extends createZodDto(collectorsSchema) {}

export class CollectorsQueryDto extends createZodDto(collectorsQuerySchema) {}

export class CollectionParamsDto extends createZodDto(collectionParamsSchema) {}

export class PlayerCollectionDto extends createZodDto(playerCollectionSchema) {}
