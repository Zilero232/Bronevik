import type { ModOverallRatings, ModOverview, ModSessionRatings } from '@otmetki/schemas';

import type { LatestSessionRow, OverallRatingRow } from '../../selects';
import type { ModOverviewInput } from './mod-overview.types';

import { clampPercent, percentOf, ratingValue, ratio, toIso, toNumber } from '../../../../common/lib';

const toOverall = (rating: OverallRatingRow): ModOverallRatings => ({
  battles: Math.max(0, rating.battles),
  win_rate: rating.battles > 0 ? clampPercent(rating.winRate) : null,
  avg_damage: rating.battles > 0 ? Math.max(0, rating.avgDamage) : null,
  wn8: ratingValue({ kind: 'wn8', value: rating.wn8 }),
  eff: ratingValue({ kind: 'eff', value: rating.eff }),
  brone_index: ratingValue({ kind: 'broneIndex', value: rating.broneIndex }),
  updated_at: rating.computedAt.toISOString()
});

const toSession = (session: LatestSessionRow): ModSessionRatings => ({
  kind: session.kind,
  source: session.source,
  is_live: session.kind === 'live' && session.status === 'open',
  started_at: session.startedAt.toISOString(),
  ended_at: toIso(session.endedAt),
  battles: Math.max(0, session.battles),
  win_rate: percentOf({ value: session.wins, by: session.battles }),
  avg_damage: ratio({ value: Math.max(0, session.damageDealt), by: session.battles }),
  wn8: ratingValue({ kind: 'wn8', value: session.wn8 }),
  brone_index: ratingValue({ kind: 'broneIndex', value: session.broneIndex })
});

export const toModOverview = ({ accountId, rating, session }: ModOverviewInput): ModOverview => ({
  account_id: toNumber(accountId),
  nickname: rating?.player.nickname ?? null,
  overall: rating ? toOverall(rating) : null,
  session: session ? toSession(session) : null
});
