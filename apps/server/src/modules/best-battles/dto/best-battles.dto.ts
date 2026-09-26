import { createZodDto } from 'nestjs-zod';

import { bestBattlesFacetsQuerySchema, bestBattlesFacetsSchema, bestBattlesPageSchema, bestBattlesQuerySchema } from './best-battles.schemas';

export class BestBattlesQueryDto extends createZodDto(bestBattlesQuerySchema) {}

export class BestBattlesPageDto extends createZodDto(bestBattlesPageSchema) {}

export class BestBattlesFacetsQueryDto extends createZodDto(bestBattlesFacetsQuerySchema) {}

export class BestBattlesFacetsDto extends createZodDto(bestBattlesFacetsSchema) {}
