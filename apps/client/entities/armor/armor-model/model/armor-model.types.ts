import type { ArmorGeometry, ArmorShell } from '@bronevik/gamedata';
import type { ArmorModelResponse } from '@bronevik/schemas';

import type { ARMOR_FACE_CLASSES } from '../config/armor-palette';

export type ArmorFaceClass = (typeof ARMOR_FACE_CLASSES)[number];

export type ArmorModelData = {
  response: ArmorModelResponse;
  geometry: ArmorGeometry;
};

export type ArmorShellState = {
  shell: ArmorShell;
  randomness: number;
};
