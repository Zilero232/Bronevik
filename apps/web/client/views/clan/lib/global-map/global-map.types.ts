import type { ClanStronghold } from '@otmetki/schemas';

import type { STRONGHOLD } from '../../config';

export type GlobalMap = ClanStronghold['globalMap'];

type GlobalMapElo = {
  tier: (typeof STRONGHOLD.eloTiers)[number];
  value: number | null;
};

export type GlobalMapSummary = {
  elo: GlobalMapElo[];
  revenue: number | null;
};
