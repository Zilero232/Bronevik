import { createZodDto } from 'nestjs-zod';

import {
  candidateListSchema,
  candidateSchema,
  candidatesQuerySchema,
  candidateStatsSchema,
  clanEventListSchema,
  clanEventParamsSchema,
  clanEventSchema,
  clanEventsQuerySchema,
  clanParamsSchema,
  createCandidateSchema,
  createClanEventSchema,
  rsvpSchema,
  setAttendanceSchema,
  updateCandidateSchema,
  updateClanEventSchema,
  weeklyReportSchema,
  workspaceSchema
} from './clan-workspace.schemas';

export class ClanParamsDto extends createZodDto(clanParamsSchema) {}
export class ClanEventParamsDto extends createZodDto(clanEventParamsSchema) {}
export class CandidateStatsDto extends createZodDto(candidateStatsSchema) {}
export class ClanEventDto extends createZodDto(clanEventSchema) {}
export class ClanEventListDto extends createZodDto(clanEventListSchema) {}
export class ClanEventsQueryDto extends createZodDto(clanEventsQuerySchema) {}
export class CreateClanEventDto extends createZodDto(createClanEventSchema) {}
export class UpdateClanEventDto extends createZodDto(updateClanEventSchema) {}
export class SetAttendanceDto extends createZodDto(setAttendanceSchema) {}
export class RsvpDto extends createZodDto(rsvpSchema) {}
export class CandidateDto extends createZodDto(candidateSchema) {}
export class CandidateListDto extends createZodDto(candidateListSchema) {}
export class CandidatesQueryDto extends createZodDto(candidatesQuerySchema) {}
export class CreateCandidateDto extends createZodDto(createCandidateSchema) {}
export class UpdateCandidateDto extends createZodDto(updateCandidateSchema) {}
export class WeeklyReportDto extends createZodDto(weeklyReportSchema) {}
export class WorkspaceDto extends createZodDto(workspaceSchema) {}
