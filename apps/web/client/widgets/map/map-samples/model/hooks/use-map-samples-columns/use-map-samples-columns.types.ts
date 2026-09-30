import type { TankMapSample } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type MapSampleRow = TankMapSample & {
  id: string;
  name: string;
  href: string;
};

export type UseMapSamplesColumnsInput = {
  nameLabel: ReactNode;
  minBattles: number;
};
