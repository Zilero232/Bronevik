import type { SeasonHistory } from '@otmetki/schemas';
import { progressionControllerSeasonHistory } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const getSeasonHistory = (accountId: number): Promise<SeasonHistory> =>
  fromSdk(() => progressionControllerSeasonHistory({ path: { id: accountId } }));
