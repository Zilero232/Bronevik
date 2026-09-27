import { modpackLatestQuerySchema, modpackLatestReleaseSchema, modpackManagerUpdateQuerySchema, modpackManagerUpdateSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class ModpackLatestQueryDto extends createZodDto(modpackLatestQuerySchema) {}
export class ModpackLatestReleaseDto extends createZodDto(modpackLatestReleaseSchema) {}
export class ModpackManagerUpdateQueryDto extends createZodDto(modpackManagerUpdateQuerySchema) {}
export class ModpackManagerUpdateDto extends createZodDto(modpackManagerUpdateSchema) {}
