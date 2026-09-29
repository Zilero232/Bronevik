import type { ArmorGeometry, ArmorVerdict } from '@otmetki/gamedata';

export type UseArmorZonesInput = {
  geometry: ArmorGeometry;
};

export type ZoneRow = {
  key: string;
  zone: string;
  verdict: ArmorVerdict | null;
  nominal: string | null;
  angle: string | null;
  effective: string | null;
  chance: string | null;
};
