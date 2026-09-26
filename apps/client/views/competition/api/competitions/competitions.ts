import type { Competition } from '@otmetki/schemas';

import type { JoinCompetitionRequest } from '@/entities/competition/competition';

import { competitionsControllerJoin, competitionsControllerLeave, competitionsControllerRemove } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const joinCompetition = ({ id, ...body }: JoinCompetitionRequest): Promise<Competition> =>
  fromSdk(() => competitionsControllerJoin({ ...SESSION_REQUEST, path: { id }, body }));

export const leaveCompetition = (id: string): Promise<Competition> =>
  fromSdk(() => competitionsControllerLeave({ ...SESSION_REQUEST, path: { id } }));

export const deleteCompetition = async (id: string): Promise<void> => {
  await fromSdk(() => competitionsControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};
