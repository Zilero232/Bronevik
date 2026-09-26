import type { RegisterTournamentInput, ReportMatchInput, Tournament, WithdrawTournamentInput } from '@/entities/tournament/tournament';

import {
  tournamentsControllerCancel,
  tournamentsControllerOpen,
  tournamentsControllerRegister,
  tournamentsControllerReport,
  tournamentsControllerStart,
  tournamentsControllerWithdraw
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const openTournament = (id: string): Promise<Tournament> => fromSdk(() => tournamentsControllerOpen({ ...SESSION_REQUEST, path: { id } }));

export const registerTournament = ({ id, ...body }: RegisterTournamentInput): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerRegister({ ...SESSION_REQUEST, path: { id }, body }));

export const startTournament = (id: string): Promise<Tournament> => fromSdk(() => tournamentsControllerStart({ ...SESSION_REQUEST, path: { id } }));

export const reportTournamentMatch = ({ id, ...body }: ReportMatchInput): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerReport({ ...SESSION_REQUEST, path: { id }, body }));

export const cancelTournament = (id: string): Promise<Tournament> => fromSdk(() => tournamentsControllerCancel({ ...SESSION_REQUEST, path: { id } }));

export const withdrawTournament = ({ id, ...body }: WithdrawTournamentInput): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerWithdraw({ ...SESSION_REQUEST, path: { id }, body }));
