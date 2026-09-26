import type { Competition, CreateCompetition } from '@otmetki/schemas';

import { competitionsControllerCreate } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const createCompetition = (body: CreateCompetition): Promise<Competition> =>
  fromSdk(() => competitionsControllerCreate({ ...SESSION_REQUEST, body }));
