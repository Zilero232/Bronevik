import type { z } from 'zod';

import type { ClanEvent, ClanEventKind, ClanRole, RecruitStatus } from '../../../generated';
import type {
  candidateSchema,
  candidateStatsSchema,
  clanEventSchema,
  createCandidateSchema,
  createClanEventSchema,
  setAttendanceSchema,
  updateCandidateSchema,
  updateClanEventSchema,
  weeklyReportSchema,
  workspaceSchema
} from './dto/clan-workspace.schemas';

export type ClanScope = { clanId: number; userId: string };
export type ClanItemScope = ClanScope & { id: string };

export type WorkspaceView = z.infer<typeof workspaceSchema>;
export type ClanEventView = z.infer<typeof clanEventSchema>;
export type CandidateView = z.infer<typeof candidateSchema>;
export type CandidateStats = z.infer<typeof candidateStatsSchema>;
export type WeeklyReportView = z.infer<typeof weeklyReportSchema>;

export type CreateClanEventRequest = Omit<z.output<typeof createClanEventSchema>, 'kind'> & ClanScope & { kind: ClanEventKind };
export type UpdateClanEventRequest = Omit<z.output<typeof updateClanEventSchema>, 'kind'> & ClanItemScope & { kind?: ClanEventKind };
export type SetAttendanceRequest = z.output<typeof setAttendanceSchema> & ClanItemScope;
export type RsvpRequest = ClanItemScope & { status: 'confirmed' | 'declined' };
export type ListEventsRequest = ClanScope & { from?: string; to?: string };
export type ListCandidatesRequest = ClanScope & { status?: RecruitStatus };
export type CreateCandidateRequest = z.output<typeof createCandidateSchema> & ClanScope;
export type UpdateCandidateRequest = z.output<typeof updateCandidateSchema> & ClanItemScope;

export type Membership = {
  accountId: bigint;
  role: ClanRole;
  isOfficer: boolean;
};

export type SyncAttendanceInput = {
  event: ClanEvent;
  now: Date;
};

export type ReportWindow = {
  clanId: bigint;
  now: Date;
};

export type ClanRecipientsInput = {
  clanId: bigint;
  officersOnly: boolean;
};
