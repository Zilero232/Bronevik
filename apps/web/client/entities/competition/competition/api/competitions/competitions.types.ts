import type { CompetitionStatus, JoinCompetitionInput as JoinCompetitionBody } from '@otmetki/schemas';

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

export type JoinCompetitionInput = JoinCompetitionBody & {
  id: string;
};
