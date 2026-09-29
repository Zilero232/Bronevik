import {
  modpackLatestQuerySchema,
  modpackLatestReleaseSchema,
  modpackManagerUpdateQuerySchema,
  modpackManagerUpdateSchema,
  modpackReleasesStatusSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class ModpackLatestQueryDto extends createZodDto(modpackLatestQuerySchema) {}
export class ModpackLatestReleaseDto extends createZodDto(modpackLatestReleaseSchema) {}
export class ModpackManagerUpdateQueryDto extends createZodDto(modpackManagerUpdateQuerySchema) {}
export class ModpackManagerUpdateDto extends createZodDto(modpackManagerUpdateSchema) {}
export class ModpackReleasesStatusDto extends createZodDto(modpackReleasesStatusSchema) {}
