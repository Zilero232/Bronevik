import type { Nation } from '@otmetki/icons';

import type { BattleBackdropDensity } from '@/shared/lib';

export type BattleBackdropTone = 'accent' | 'brass' | 'neutral' | 'steel';

export type BattleBackdropProps = {
  tone?: BattleBackdropTone;
  nation?: Nation;
  seed?: number;
  density?: BattleBackdropDensity;
  className?: string;
};
