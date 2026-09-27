import { createZodDto } from 'nestjs-zod';

import {
  contentReportListSchema,
  contentReportSchema,
  createReportSchema,
  moderateSchema,
  moderationTargetParamsSchema,
  pendingGuidesSchema,
  reportsQuerySchema,
  resolveReportSchema
} from './moderation.schemas';

export class CreateReportDto extends createZodDto(createReportSchema) {}
export class ContentReportDto extends createZodDto(contentReportSchema) {}
export class ReportsQueryDto extends createZodDto(reportsQuerySchema) {}
export class ContentReportListDto extends createZodDto(contentReportListSchema) {}
export class ResolveReportDto extends createZodDto(resolveReportSchema) {}
export class ModerateDto extends createZodDto(moderateSchema) {}
export class ModerationTargetParamsDto extends createZodDto(moderationTargetParamsSchema) {}
export class PendingGuidesDto extends createZodDto(pendingGuidesSchema) {}
