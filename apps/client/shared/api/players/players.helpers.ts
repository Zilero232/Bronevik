import { LIST_SEPARATOR } from '@bronevik/schemas';

import type { PlayerTanksFilter } from './players.types';

export const toListParams = ({ tiers, types, nations, premium, minBattles, period }: PlayerTanksFilter) => ({
  tiers: tiers?.length ? tiers.join(LIST_SEPARATOR) : undefined,
  types: types?.length ? types.join(LIST_SEPARATOR) : undefined,
  nations: nations?.length ? nations.join(LIST_SEPARATOR) : undefined,
  premium,
  minBattles,
  period
});
