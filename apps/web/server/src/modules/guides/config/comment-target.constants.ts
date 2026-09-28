import { invert } from 'remeda';

import type { CommentTarget } from '../../../../generated';

export const COMMENT_TARGET_FROM_DB = {
  build: 'build',
  guide: 'guide',
  replay: 'replay',
  tacticBoard: 'tactic_board'
} as const satisfies Record<CommentTarget, string>;

export const COMMENT_TARGET_TO_DB = invert(COMMENT_TARGET_FROM_DB) satisfies Record<(typeof COMMENT_TARGET_FROM_DB)[CommentTarget], CommentTarget>;
