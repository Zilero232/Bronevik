import type { ClanEventKind } from '../../../../../generated';

export const EVENT_KIND_FROM_DB = {
  clanWars: 'clan_wars',
  stronghold: 'stronghold',
  training: 'training',
  tournament: 'tournament',
  other: 'other'
} as const satisfies Record<ClanEventKind, string>;

export const EVENT_KIND_TO_DB = {
  clan_wars: 'clanWars',
  stronghold: 'stronghold',
  training: 'training',
  tournament: 'tournament',
  other: 'other'
} as const satisfies Record<(typeof EVENT_KIND_FROM_DB)[ClanEventKind], ClanEventKind>;
