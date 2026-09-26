import type { Tournament } from '@/shared/api/tournaments';

export type TournamentToastKey = 'cancelled' | 'opened' | 'registered' | 'reported' | 'started';

export type UseTournamentMutationInput<TInput> = {
  mutationFn: (input: TInput) => Promise<Tournament>;
  successKey: TournamentToastKey;
};
