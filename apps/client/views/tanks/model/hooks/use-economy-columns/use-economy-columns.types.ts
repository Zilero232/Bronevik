import type { TankEconomyRow } from '@otmetki/schemas';

import type { EconomyView } from '@/entities/tank/tank';

export type UseEconomyColumnsInput = {
  view: (row: TankEconomyRow) => EconomyView | null;
};
