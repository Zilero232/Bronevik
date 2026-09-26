import { WATCHLIST } from '@otmetki/schemas';
import { addHours, isBefore } from 'date-fns';
import { sortBy, sumBy } from 'remeda';

import type { IsDigestDueInput, SummarizeDigestInput, WatchlistDigestSummary } from './watchlist-digest.types';

const DUE_SLACK_MINUTES = 10;

export const isDigestDue = ({ digest, lastDigestAt, now }: IsDigestDueInput): boolean => {
  if (digest === 'off') {
    return false;
  }

  if (!lastDigestAt) {
    return true;
  }

  const dueAt = addHours(lastDigestAt, WATCHLIST.digestHours[digest]);

  return !isBefore(now, new Date(dueAt.getTime() - DUE_SLACK_MINUTES * 60_000));
};

export const digestWindowStart = ({ digest, lastDigestAt, now }: IsDigestDueInput): Date =>
  lastDigestAt ?? addHours(now, digest === 'off' ? -WATCHLIST.digestHours.daily : -WATCHLIST.digestHours[digest]);

export const summarizeDigest = ({ players, limit }: SummarizeDigestInput): WatchlistDigestSummary | null => {
  const active = players.filter((player) => player.battles > 0 || player.marksGained > 0);

  if (active.length === 0) {
    return null;
  }

  return {
    activePlayers: active.length,
    battles: sumBy(active, (player) => player.battles),
    marksGained: sumBy(active, (player) => player.marksGained),
    top: sortBy(active, [(player) => player.marksGained, 'desc'], [(player) => player.battles, 'desc'])
      .slice(0, limit)
      .map((player) => ({
        nickname: player.nickname,
        battles: player.battles,
        winRate: player.battles > 0 ? Math.round((player.wins * 1000) / player.battles) / 10 : 0,
        marksGained: player.marksGained
      }))
  };
};
