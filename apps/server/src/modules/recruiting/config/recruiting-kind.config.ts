import type { RecruitingPostKind } from '../../../../generated';

export const RECRUITING_KIND_FROM_DB = {
  clanSeeksPlayer: 'clan_seeks_player',
  playerSeeksClan: 'player_seeks_clan'
} as const satisfies Record<RecruitingPostKind, string>;

export const RECRUITING_KIND_TO_DB = {
  clan_seeks_player: 'clanSeeksPlayer',
  player_seeks_clan: 'playerSeeksClan'
} as const satisfies Record<(typeof RECRUITING_KIND_FROM_DB)[RecruitingPostKind], RecruitingPostKind>;
