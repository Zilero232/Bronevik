import type { ArmorGeometry, ArmorShell } from '@otmetki/gamedata';
import type { ArmorModelResponse } from '@otmetki/schemas';

import type { ARMOR_FACE_CLASSES } from '../config';

export type ArmorFaceClass = (typeof ARMOR_FACE_CLASSES)[number];

export type ArmorModelData = {
  response: ArmorModelResponse;
  geometry: ArmorGeometry;
};

export type ArmorShellState = {
  shell: ArmorShell;
  randomness: number;
};
