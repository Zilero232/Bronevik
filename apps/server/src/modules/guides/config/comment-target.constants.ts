import type { CommentTarget } from '../../../../generated';

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
