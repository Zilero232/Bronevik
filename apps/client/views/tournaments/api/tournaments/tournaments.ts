import type { CreateTournament, Tournament } from '@/entities/tournament/tournament';
import { tournamentsControllerCreate } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const createTournament = (body: CreateTournament): Promise<Tournament> =>
  fromSdk(() => tournamentsControllerCreate({ ...SESSION_REQUEST, body }));
