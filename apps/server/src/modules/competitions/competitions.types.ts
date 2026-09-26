import type { CompetitionsQuery, CreateCompetition, JoinCompetitionInput } from '@otmetki/schemas';

import type { Competition, CompetitionSource, Prisma } from '../../../generated';
import type { ParticipantScore } from './lib/competition-scoring';
import type { COMPETITION_SUMMARY_INCLUDE } from './selects';

export type CompetitionListInput = {
  query: CompetitionsQuery;
  viewerUserId: string | null;
};

export type CompetitionGetInput = {
  slug: string;
  viewerUserId: string | null;
  code: string | undefined;
};

export type CompetitionCreateInput = CreateCompetition & {
  userId: string;
};

export type CompetitionJoinInput = JoinCompetitionInput & {
  id: string;
  userId: string;
};

export type CompetitionOwnedInput = {
  id: string;
  userId: string;
};

export type ScoreCompetitionInput = {
  competition: Competition;
  now: Date;
};

export type ScoreEntryInput = {
  competition: Competition;
  accountId: bigint;
  joinedAt: Date;
};

export type CanViewInput = {
  competition: Competition;
  viewerUserId: string | null;
  code: string | undefined;
};

export type TeamLookupInput = {
  competitionId: string;
  teamId: string;
};

export type NewTeamInput = {
  competitionId: string;
  name: string;
};

export type CompetitionWithSummary = Prisma.CompetitionGetPayload<{ include: typeof COMPETITION_SUMMARY_INCLUDE }>;

export type ToSummaryInput = {
  row: CompetitionWithSummary;
  now: Date;
};

export type ToViewInput = {
  row: CompetitionWithSummary;
  viewerUserId: string | null;
};

export type EntryScore = ParticipantScore & {
  source: CompetitionSource;
};
