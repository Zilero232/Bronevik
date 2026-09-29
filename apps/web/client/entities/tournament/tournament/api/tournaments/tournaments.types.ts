import type { RegisterTournament, ReportMatch, Tournament, TournamentsControllerListData, WithdrawTournament } from '@/shared/api/generated';

export type { CreateTournament, Tournament, TournamentPage } from '@/shared/api/generated';

export type TournamentStatus = Tournament['status'];

export type TournamentBracket = NonNullable<Tournament['bracket']>;

export type TournamentParticipant = Tournament['participants'][number];

export type ListTournamentsInput = NonNullable<TournamentsControllerListData['query']> & {
  signal?: AbortSignal;
};

export type GetTournamentInput = {
  slug: string;
  signal?: AbortSignal;
};

export type RegisterTournamentInput = RegisterTournament & {
  id: string;
};

export type WithdrawTournamentInput = WithdrawTournament & {
  id: string;
};

export type ReportMatchInput = ReportMatch & {
  id: string;
};
