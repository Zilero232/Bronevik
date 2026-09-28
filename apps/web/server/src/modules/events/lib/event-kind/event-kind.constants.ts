import type { GameEventKind as GameEventKindView } from '@otmetki/schemas';

import { invert } from 'remeda';

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

export const EVENT_KIND_TO_DB = invert(EVENT_KIND_FROM_DB) satisfies Record<GameEventKindView, GameEventKind>;
