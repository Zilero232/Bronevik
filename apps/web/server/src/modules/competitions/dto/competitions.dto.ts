import {
  competitionAccessQuerySchema,
  competitionIdParamsSchema,
  competitionPageSchema,
  competitionSchema,
  competitionSlugParamsSchema,
  competitionsQuerySchema,
  createCompetitionSchema,
  joinCompetitionSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class CompetitionDto extends createZodDto(competitionSchema) {}
export class CompetitionPageDto extends createZodDto(competitionPageSchema) {}
export class CompetitionsQueryDto extends createZodDto(competitionsQuerySchema) {}
export class CompetitionSlugParamsDto extends createZodDto(competitionSlugParamsSchema) {}
export class CompetitionIdParamsDto extends createZodDto(competitionIdParamsSchema) {}
export class CompetitionAccessQueryDto extends createZodDto(competitionAccessQuerySchema) {}
export class CreateCompetitionDto extends createZodDto(createCompetitionSchema) {}
export class JoinCompetitionDto extends createZodDto(joinCompetitionSchema) {}
