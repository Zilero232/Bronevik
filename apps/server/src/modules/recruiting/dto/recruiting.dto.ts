import { createZodDto } from 'nestjs-zod';

import { createRecruitingSchema, recruitingPageSchema, recruitingPostSchema, recruitingQuerySchema } from './recruiting.schemas';

export class RecruitingPostDto extends createZodDto(recruitingPostSchema) {}
export class RecruitingQueryDto extends createZodDto(recruitingQuerySchema) {}
export class RecruitingPageDto extends createZodDto(recruitingPageSchema) {}
export class CreateRecruitingDto extends createZodDto(createRecruitingSchema) {}
