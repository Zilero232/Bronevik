import type { ArmorGeometry, ArmorShell } from '@otmetki/gamedata';
import type { ArmorModelResponse } from '@otmetki/schemas';

export type ArmorModelData = {
  response: ArmorModelResponse;
  geometry: ArmorGeometry;
};

export type ArmorShellState = {
  shell: ArmorShell;
  randomness: number;
};
