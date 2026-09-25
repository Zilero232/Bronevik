import { buildSchema, createBuildSchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

export class BuildDto extends createZodDto(buildSchema) {}
export class CreateBuildDto extends createZodDto(createBuildSchema) {}
