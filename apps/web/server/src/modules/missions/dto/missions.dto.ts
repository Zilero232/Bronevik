import {
  missionCampaignsSchema,
  missionGarageSchema,
  missionOperationParamsSchema,
  missionOperationSchema,
  missionParamsSchema,
  missionPlanQuerySchema,
  missionPlanSchema,
  missionProgressItemSchema,
  missionProgressSchema,
  missionTanksQuerySchema,
  missionTanksSchema,
  updateMissionProgressSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class MissionCampaignsDto extends createZodDto(missionCampaignsSchema) {}
export class MissionOperationDto extends createZodDto(missionOperationSchema) {}
export class MissionOperationParamsDto extends createZodDto(missionOperationParamsSchema) {}
export class MissionParamsDto extends createZodDto(missionParamsSchema) {}
export class MissionTanksQueryDto extends createZodDto(missionTanksQuerySchema) {}
export class MissionTanksDto extends createZodDto(missionTanksSchema) {}
export class MissionGarageDto extends createZodDto(missionGarageSchema) {}
export class MissionProgressDto extends createZodDto(missionProgressSchema) {}
export class MissionProgressItemDto extends createZodDto(missionProgressItemSchema) {}
export class UpdateMissionProgressDto extends createZodDto(updateMissionProgressSchema) {}
export class MissionPlanQueryDto extends createZodDto(missionPlanQuerySchema) {}
export class MissionPlanDto extends createZodDto(missionPlanSchema) {}
