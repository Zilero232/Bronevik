import { socialControllerYearWrapped } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { PlayerWrapped, PlayerWrappedInput } from './wrapped.types';

export const getPlayerWrapped = ({ accountId, year, signal }: PlayerWrappedInput): Promise<PlayerWrapped> =>
  fromSdk(() => socialControllerYearWrapped({ path: { id: accountId }, query: { year }, signal }));
