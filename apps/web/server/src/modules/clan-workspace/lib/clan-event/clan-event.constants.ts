import { invert } from 'remeda';

import type { ClanEventKind } from '../../../../../generated';

export const EVENT_KIND_FROM_DB = {
  clanWars: 'clan_wars',
  stronghold: 'stronghold',
  training: 'training',
  tournament: 'tournament',
  other: 'other'
} as const satisfies Record<ClanEventKind, string>;

export const EVENT_KIND_TO_DB = invert(EVENT_KIND_FROM_DB) satisfies Record<(typeof EVENT_KIND_FROM_DB)[ClanEventKind], ClanEventKind>;
