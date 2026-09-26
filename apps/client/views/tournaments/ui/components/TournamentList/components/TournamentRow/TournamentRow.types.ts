import type { TournamentPage } from '@/entities/tournament/tournament';

export type TournamentRowProps = {
  tournament: TournamentPage['items'][number];
};
