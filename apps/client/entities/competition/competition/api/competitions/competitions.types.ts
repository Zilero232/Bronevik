import type { CompetitionStatus, JoinCompetitionInput } from '@otmetki/schemas';

export type ListCompetitionsInput = {
  status?: CompetitionStatus;
  mine?: boolean;
  limit: number;
  offset: number;
  signal?: AbortSignal;
};

export type GetCompetitionInput = {
  slug: string;
  code?: string;
  signal?: AbortSignal;
};

export type JoinCompetitionRequest = JoinCompetitionInput & {
  id: string;
};
