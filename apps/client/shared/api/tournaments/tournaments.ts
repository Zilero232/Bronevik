import type {
  CreateTournament,
  GetTournamentInput,
  ListTournamentsInput,
  RegisterTournamentInput,
  ReportMatchInput,
  Tournament,
  TournamentPage
} from './tournaments.types';

import {
  tournamentsControllerCancel,
  tournamentsControllerCreate,
  tournamentsControllerGet,
  tournamentsControllerList,
  tournamentsControllerOpen,
  tournamentsControllerRegister,
  tournamentsControllerReport,
  tournamentsControllerStart
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const listTournaments = ({ signal, ...query }: ListTournamentsInput): Promise<TournamentPage> =>
  fromSdk(() => tournamentsControllerList({ ...SESSION_REQUEST, query, signal }));

export const getTournament = ({ slug, signal }: GetTournamentInput): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerGet({ ...SESSION_REQUEST, path: { slug }, signal }));

export const createTournament = (body: CreateTournament): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerCreate({ ...SESSION_REQUEST, body }));

export const openTournament = (id: string): Promise<Tournament> => fromSdk(() => tournamentsControllerOpen({ ...SESSION_REQUEST, path: { id } }));

export const registerTournament = ({ id, ...body }: RegisterTournamentInput): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerRegister({ ...SESSION_REQUEST, path: { id }, body }));

export const startTournament = (id: string): Promise<Tournament> => fromSdk(() => tournamentsControllerStart({ ...SESSION_REQUEST, path: { id } }));

export const reportTournamentMatch = ({ id, ...body }: ReportMatchInput): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerReport({ ...SESSION_REQUEST, path: { id }, body }));

export const cancelTournament = (id: string): Promise<Tournament> => fromSdk(() => tournamentsControllerCancel({ ...SESSION_REQUEST, path: { id } }));
