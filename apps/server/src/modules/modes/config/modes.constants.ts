import type { ModeRank, PlayMode } from '@otmetki/schemas';

import type { GameEventKind } from '../../../../generated';

export const MODE_RANKING = {
  priorBattles: 50,
  shares: [
    { rank: 'S', upTo: 0.1 },
    { rank: 'A', upTo: 0.3 },
    { rank: 'B', upTo: 0.7 },
    { rank: 'C', upTo: 0.9 },
    { rank: 'D', upTo: 1 }
  ]
} as const satisfies { priorBattles: number; shares: readonly { rank: ModeRank; upTo: number }[] };

export const MODE_SEASON_EVENT = {
  onslaught: 'onslaught',
  frontline: 'frontLine',
  ranked: 'ranked',
  steelHunter: null
} as const satisfies Record<PlayMode, GameEventKind | null>;
