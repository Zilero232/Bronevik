import type { TankMapSample } from '@otmetki/schemas';

export type MapSampleRow = TankMapSample & {
  id: string;
  name: string;
  href: string;
};
