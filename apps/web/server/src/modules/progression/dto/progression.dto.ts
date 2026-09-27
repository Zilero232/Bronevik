import {
  cosmeticCodeParamsSchema,
  cosmeticsInventorySchema,
  equipCosmeticsSchema,
  profileCosmeticsListSchema,
  profileCosmeticsQuerySchema,
  profileCosmeticsSchema,
  seasonHistorySchema,
  seasonTrackSchema,
  shellsSchema,
  tankChallengesSchema,
  tankProgressListSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { accountParamsSchema } from './progression.schemas';

export class TankProgressListDto extends createZodDto(tankProgressListSchema) {}
export class TankChallengesDto extends createZodDto(tankChallengesSchema) {}
export class SeasonTrackDto extends createZodDto(seasonTrackSchema) {}
export class SeasonHistoryDto extends createZodDto(seasonHistorySchema) {}
export class ShellsDto extends createZodDto(shellsSchema) {}
export class CosmeticsInventoryDto extends createZodDto(cosmeticsInventorySchema) {}
export class EquipCosmeticsDto extends createZodDto(equipCosmeticsSchema) {}
export class CosmeticCodeParamsDto extends createZodDto(cosmeticCodeParamsSchema) {}
export class ProfileCosmeticsDto extends createZodDto(profileCosmeticsSchema) {}
export class ProfileCosmeticsListDto extends createZodDto(profileCosmeticsListSchema) {}
export class ProfileCosmeticsQueryDto extends createZodDto(profileCosmeticsQuerySchema) {}
export class AccountParamsDto extends createZodDto(accountParamsSchema) {}
