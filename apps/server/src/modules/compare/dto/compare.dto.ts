import { playerComparisonSchema, tankComparisonSchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

import { comparePlayersQuerySchema, compareTanksQuerySchema } from './compare.schemas';

export class ComparePlayersQueryDto extends createZodDto(comparePlayersQuerySchema) {}
export class CompareTanksQueryDto extends createZodDto(compareTanksQuerySchema) {}
export class PlayerComparisonDto extends createZodDto(playerComparisonSchema) {}
export class TankComparisonDto extends createZodDto(tankComparisonSchema) {}
