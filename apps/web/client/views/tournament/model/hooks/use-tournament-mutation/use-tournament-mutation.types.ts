import type { Tournament } from '@/entities/tournament/tournament';

export type TournamentToastKey = 'cancelled' | 'opened' | 'registered' | 'reported' | 'started' | 'withdrawn';

export type UseTournamentMutationInput<TInput> = {
  mutationFn: (input: TInput) => Promise<Tournament>;
  successKey: TournamentToastKey;
};
