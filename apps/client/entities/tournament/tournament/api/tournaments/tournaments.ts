import { tournamentsControllerGet, tournamentsControllerList } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { GetTournamentInput, ListTournamentsInput, Tournament, TournamentPage } from './tournaments.types';

export const listTournaments = ({ signal, ...query }: ListTournamentsInput): Promise<TournamentPage> =>
  fromSdk(() => tournamentsControllerList({ ...SESSION_REQUEST, query, signal }));

export const getTournament = ({ slug, signal }: GetTournamentInput): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerGet({ ...SESSION_REQUEST, path: { slug }, signal }));
