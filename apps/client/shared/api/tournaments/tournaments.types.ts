import type { Tournament, TournamentsControllerListData } from '../generated';

export type { CreateTournament, RegisterTournament, ReportMatch, Tournament, TournamentPage } from '../generated';

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

export type RegisterTournamentInput = {
  id: string;
  accountId?: number;
  teamName?: string;
};

export type ReportMatchInput = {
  id: string;
  round: number;
  index: number;
  winner: number;
};
