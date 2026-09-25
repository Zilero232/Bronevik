import type { CommentTarget, RecruitingPostKind } from '../../../../../generated';

export const COMMENT_TARGET_FROM_DB = {
  build: 'build',
  guide: 'guide',
  replay: 'replay',
  tacticBoard: 'tactic_board'
} as const satisfies Record<CommentTarget, string>;

export const COMMENT_TARGET_TO_DB = {
  build: 'build',
  guide: 'guide',
  replay: 'replay',
  tactic_board: 'tacticBoard'
} as const satisfies Record<(typeof COMMENT_TARGET_FROM_DB)[CommentTarget], CommentTarget>;

export const RECRUITING_KIND_FROM_DB = {
  clanSeeksPlayer: 'clan_seeks_player',
  playerSeeksClan: 'player_seeks_clan'
} as const satisfies Record<RecruitingPostKind, string>;

export const RECRUITING_KIND_TO_DB = {
  clan_seeks_player: 'clanSeeksPlayer',
  player_seeks_clan: 'playerSeeksClan'
} as const satisfies Record<(typeof RECRUITING_KIND_FROM_DB)[RecruitingPostKind], RecruitingPostKind>;
