import type { Tournament } from '../tournaments';

export type TournamentRouteMeta = Pick<Tournament, 'title'> & {
  isListed: boolean;
};
