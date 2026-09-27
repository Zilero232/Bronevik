import type { TankEconomyRow } from '@otmetki/schemas';

import type { EconomyView } from '@/entities/tank/tank';

export type EconomyCardProps = {
  row: TankEconomyRow;
  view: EconomyView | null;
};
