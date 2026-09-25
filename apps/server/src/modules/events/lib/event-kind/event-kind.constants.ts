import type { GameEventKind as GameEventKindView } from '@bronevik/schemas';

import type { GameEventKind } from '../../../../../generated';

export const EVENT_KIND_FROM_DB = {
  event: 'event',
  sale: 'sale',
  marathon: 'marathon',
  battlePass: 'battle_pass',
  frontLine: 'front_line',
  onslaught: 'onslaught',
  ranked: 'ranked',
  personalMissions: 'personal_missions',
  drops: 'drops',
  other: 'other'
} as const satisfies Record<GameEventKind, GameEventKindView>;

export const EVENT_KIND_TO_DB = {
  event: 'event',
  sale: 'sale',
  marathon: 'marathon',
  battle_pass: 'battlePass',
  front_line: 'frontLine',
  onslaught: 'onslaught',
  ranked: 'ranked',
  personal_missions: 'personalMissions',
  drops: 'drops',
  other: 'other'
} as const satisfies Record<GameEventKindView, GameEventKind>;
