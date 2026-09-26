import { createZodDto } from 'nestjs-zod';

import { idParamsSchema, likeResultSchema, slugParamsSchema } from './community-core.schemas';

export class IdParamsDto extends createZodDto(idParamsSchema) {}
export class SlugParamsDto extends createZodDto(slugParamsSchema) {}
export class LikeResultDto extends createZodDto(likeResultSchema) {}
