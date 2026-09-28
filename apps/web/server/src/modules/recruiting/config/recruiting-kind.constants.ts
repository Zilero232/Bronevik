import { invert } from 'remeda';

import type { RecruitingPostKind } from '../../../../generated';

export const RECRUITING_KIND_FROM_DB = {
  clanSeeksPlayer: 'clan_seeks_player',
  playerSeeksClan: 'player_seeks_clan'
} as const satisfies Record<RecruitingPostKind, string>;

export const RECRUITING_KIND_TO_DB = invert(RECRUITING_KIND_FROM_DB) satisfies Record<
  (typeof RECRUITING_KIND_FROM_DB)[RecruitingPostKind],
  RecruitingPostKind
>;
