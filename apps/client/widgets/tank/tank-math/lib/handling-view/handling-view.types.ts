import type { GunHandling, HandlingScenario } from '@otmetki/gamedata';

import type { HANDLING_ROWS } from '../../config';

export type HandlingCurves = {
  times: number[];
  series: { scenario: HandlingScenario; values: number[] }[];
};

export type HandlingRowId = (typeof HANDLING_ROWS)[number];

export type HandlingRow = {
  id: HandlingRowId;
  value: number;
  delta: number | null;
};

export type HandlingRowsInput = {
  handling: GunHandling;
  other?: GunHandling | null;
};
