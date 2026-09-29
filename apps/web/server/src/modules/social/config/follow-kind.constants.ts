import type { FollowKind } from '@otmetki/schemas';

import type { TargetKind } from '../../../../generated';

export const FOLLOW_KIND_FROM_DB = {
  player: 'player',
  clan: 'clan',
  tank: 'tank'
} as const satisfies Record<TargetKind, FollowKind>;
