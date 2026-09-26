import { buildSchema, createBuildSchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

import { buildListSchema, buildPageSchema, buildsQuerySchema, tankParamsSchema, updateBuildSchema } from './community-builds.schemas';

export class BuildDto extends createZodDto(buildSchema) {}
export class CreateBuildDto extends createZodDto(createBuildSchema) {}
export class TankParamsDto extends createZodDto(tankParamsSchema) {}
export class BuildsQueryDto extends createZodDto(buildsQuerySchema) {}
export class BuildPageDto extends createZodDto(buildPageSchema) {}
export class BuildListDto extends createZodDto(buildListSchema) {}
export class UpdateBuildDto extends createZodDto(updateBuildSchema) {}
